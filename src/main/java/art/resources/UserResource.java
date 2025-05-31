package art.resources;

import art.dtos.ArtistDto;
import art.dtos.CommissionCardDto;
import art.dtos.CommissionCardElementDto;
import art.dtos.SocialProfileDto;
import art.dtos.UserDto;
import art.entities.Artist;
import art.entities.CommissionCard;
import art.entities.CommissionCardElement;
import art.entities.SocialProfile;
import art.entities.Tag;
import art.entities.User;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Path("/users")
public class UserResource {

    @Inject
    SecurityIdentity identity;

    /**
     * Validates if a user exists by username.
     * @param username the username to check
     * @return Response indicating the validation result
     *         Returns null if the user exists, otherwise returns an error response.
     */
    private Response validateUserExists(String username) {
        User user = User.findByUsername(username);
        if (user == null) {
            return errorResponse(Response.Status.NOT_FOUND, "User not found");
        }
        return null; // null means validation passed
    }

    /**
     * Validates if an artist exists by username.
     * @param username the username to check
     * @return Response indicating the validation result
     *         Returns null if the artist exists, otherwise returns an error response.
     */
    private Response validateArtistExists(String username) {
        User user = User.findByUsername(username);
        if (user == null || !"artist".equals(user.role)) {
            return errorResponse(Response.Status.NOT_FOUND, "Artist not found");
        }
        return null;
    }

    /**
     * Validates if the current user is the owner of the viewed account.
     * @param username the username to check
     * @return Response indicating the validation result
     *         Returns null if ownership is valid, otherwise returns a forbidden response.
     */
    private Response validateOwnership(String username) {
        Principal principal = identity.getPrincipal();
        if (principal == null || !username.equals(principal.getName())) {
            return errorResponse(Response.Status.FORBIDDEN, "You can only modify your own account");
        }
        return null;
    }

    /**
     * Validates if the artist has a commission card.
     * @param artist the artist to check
     * @return Response indicating the validation result
     *         Returns null if the commission card exists, otherwise returns a not found response.
     */
    private Response validateCommissionCardExists(Artist artist) {
        if (artist.commissionCard == null) {
            return errorResponse(Response.Status.NOT_FOUND, "Commission card not found");
        }
        return null;
    }

    /**
     * Creates a standardized error response.
     * @param status the HTTP status code
     * @param message the error message
     * @return Response with the specified status and message
     */
    private Response errorResponse(Response.Status status, String message) {
        return Response.status(status).entity(Map.of("message", message)).build();
    }

    /**
     * Creates a standardized success response.
     * @param message the success message
     * @return Response with status 200 OK and the message
     */
    private Response successResponse(String message) {
        return Response.ok(Map.of("message", message)).build();
    }

    /**
     * Retrieves all users in the system.
     * @return Response containing a list of UserDto objects
     */
    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllUsers() {
        var users = User.findAllUsers().stream()
                .map(UserDto::new)
                .toList();
        return Response.ok(users).build();
    }

    @GET
    @Path("/me")
    public Response me() {
        if (identity.isAnonymous()) {
            return Response.ok(Map.of("username", "")).build();
        }
        String username = identity.getPrincipal().getName();
        return Response.ok(Map.of("username", username)).build();
    }

    @GET
    @Path("/artists")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getArtists(@QueryParam("verified") Boolean verified,
            @QueryParam("openForCommissions") Boolean openForCommissions) {

        List<Artist> artists;

        if (verified != null && openForCommissions != null) {
            artists = Artist.list("verified = ?1 and isOpenForCommissions = ?2", verified, openForCommissions);
        } else if (verified != null) {
            artists = verified ? Artist.findAllVerifiedArtists() : Artist.list("verified", false);
        } else if (openForCommissions != null) {
            artists = Artist.list("isOpenForCommissions", openForCommissions);
        } else {
            artists = Artist.findAllArtists();
        }

        var artistDtos = artists.stream()
                .map(ArtistDto::new)
                .toList();

        return Response.ok(artistDtos).build();
    }

    @GET
    @Path("/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUser(@PathParam("username") String username) {
        Response validation = validateUserExists(username);
        if (validation != null) return validation;

        User user = User.findByUsername(username);

        if ("artist".equals(user.role)) {
            Artist artist = (Artist) user;
            ArtistDto artistDto = new ArtistDto(artist);
            return Response.ok(artistDto).build();
        } else {
            UserDto userDto = new UserDto(user);
            return Response.ok(userDto).build();
        }
    }

    @GET
    @Path("/{username}/commission-card")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCommissionCard(@PathParam("username") String username) {
        Response validation = validateArtistExists(username);
        if (validation != null) return validation;

        Artist artist = (Artist) User.findByUsername(username);
        validation = validateCommissionCardExists(artist);
        if (validation != null) return validation;

        return Response.ok(new CommissionCardDto(artist.commissionCard)).build();
    }

    @POST
    @Path("/{username}/commission-card")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response createCommissionCard(@PathParam("username") String username, CommissionCardDto cardDetails) {
        Response validation = validateArtistExists(username);
        if (validation != null) return validation;
        
        validation = validateOwnership(username);
        if (validation != null) return validation;

        Artist artist = (Artist) User.findByUsername(username);
        if (artist.commissionCard != null) {
            return errorResponse(Response.Status.CONFLICT, 
                "Artist already has a commission card. Use PUT to update or DELETE first.");
        }

        CommissionCard commissionCard = new CommissionCard();
        commissionCard.title = cardDetails.title;
        commissionCard.description = cardDetails.description;
        commissionCard.elements = new ArrayList<>();

        artist.commissionCard = commissionCard;
        commissionCard.artist = artist;

        commissionCard.persist();
        artist.persist();

        return Response.status(Response.Status.CREATED)
                .entity(new CommissionCardDto(commissionCard))
                .build();
    }

    @POST
    @Path("/{username}/commission-card/elements")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response createCommissionCardElement(@PathParam("username") String username, CommissionCardElementDto elementDto) {
        Response validation = validateArtistExists(username);
        if (validation != null) return validation;
        
        validation = validateOwnership(username);
        if (validation != null) return validation;

        Artist artist = (Artist) User.findByUsername(username);
        validation = validateCommissionCardExists(artist);
        if (validation != null) return validation;

        // Validate required fields
        if (elementDto.title == null || elementDto.title.trim().isEmpty()) {
            return errorResponse(Response.Status.BAD_REQUEST, "Element title is required");
        }
        if (elementDto.description == null || elementDto.description.trim().isEmpty()) {
            return errorResponse(Response.Status.BAD_REQUEST, "Element description is required");
        }

        CommissionCardElement element = new CommissionCardElement();
        element.title = elementDto.title.trim();
        element.description = elementDto.description.trim();
        element.price = elementDto.price;
        element.exampleImageUrls = elementDto.exampleImageUrls != null ? 
            new ArrayList<>(elementDto.exampleImageUrls) : new ArrayList<>();
        element.commissionCard = artist.commissionCard;

        artist.commissionCard.addElement(element);
        element.persist();
        artist.persist();

        return Response.status(Response.Status.CREATED)
                .entity(new CommissionCardElementDto(element))
                .build();
    }

    @PUT
    @Path("/{username}/commission-card/elements/{elementId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response updateCommissionCardElement(
            @PathParam("username") String username,
            @PathParam("elementId") Long elementId,
            Map<String, Object> updates) {
        
        Response validation = validateArtistExists(username);
        if (validation != null) return validation;
        
        validation = validateOwnership(username);
        if (validation != null) return validation;

        Artist artist = (Artist) User.findByUsername(username);
        validation = validateCommissionCardExists(artist);
        if (validation != null) return validation;

        CommissionCardElement element = CommissionCardElement.findById(elementId);
        if (element == null || !element.commissionCard.id.equals(artist.commissionCard.id)) {
            return errorResponse(Response.Status.NOT_FOUND, "Commission card element not found");
        }

        // Update fields that are present in the request
        if (updates.containsKey("price")) {
            Object priceValue = updates.get("price");
            if (priceValue instanceof Number) {
                element.price = ((Number) priceValue).doubleValue();
            } else if (priceValue == null) {
                element.price = null;
            }
        }

        if (updates.containsKey("exampleImageUrls")) {
            Object imageUrls = updates.get("exampleImageUrls");
            if (imageUrls instanceof List) {
                element.exampleImageUrls = (List<String>) imageUrls;
            }
        }

        if (updates.containsKey("title")) {
            element.title = (String) updates.get("title");
        }

        if (updates.containsKey("description")) {
            element.description = (String) updates.get("description");
        }

        element.persist();

        return successResponse("Commission card element updated successfully");
    }

    @DELETE
    @Path("/{username}/commission-card/elements/{elementId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response deleteCommissionCardElement(
            @PathParam("username") String username,
            @PathParam("elementId") Long elementId) {
        
        Response validation = validateArtistExists(username);
        if (validation != null) return validation;
        
        validation = validateOwnership(username);
        if (validation != null) return validation;

        Artist artist = (Artist) User.findByUsername(username);
        validation = validateCommissionCardExists(artist);
        if (validation != null) return validation;

        CommissionCardElement element = CommissionCardElement.findById(elementId);
        if (element == null || !element.commissionCard.id.equals(artist.commissionCard.id)) {
            return errorResponse(Response.Status.NOT_FOUND, "Commission card element not found");
        }

        artist.commissionCard.removeElement(element);
        element.delete();
        artist.persist();

        return successResponse("Commission card element deleted successfully");
    }

    @DELETE
    @Path("/{username}/commission-card")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response deleteCommissionCard(@PathParam("username") String username) {
        Response validation = validateArtistExists(username);
        if (validation != null) return validation;
        
        validation = validateOwnership(username);
        if (validation != null) return validation;

        Artist artist = (Artist) User.findByUsername(username);
        validation = validateCommissionCardExists(artist);
        if (validation != null) return validation;

        artist.commissionCard = null;
        artist.persist();

        return successResponse("Commission card deleted successfully");
    }

    @POST
    @Path("/{username}/social/bluesky")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response addBluesky(@PathParam("username") String username, SocialProfileDto socialProfileDto) {
        Response validation = validateUserExists(username);
        if (validation != null) return validation;
        
        validation = validateOwnership(username);
        if (validation != null) return validation;

        User user = User.findByUsername(username);
        SocialProfile socialProfile = new SocialProfile();
        socialProfile.platform = "bluesky";
        socialProfile.username = socialProfileDto.username;
        socialProfile.profileUrl = "https://bsky.app/profile/" + socialProfileDto.username;
        socialProfile.isVerified = socialProfileDto.isVerified;
        socialProfile.user = user;

        user.socialProfiles.add(socialProfile);
        socialProfile.persist();

        if ("artist".equals(user.role) && socialProfileDto.isVerified) {
            Artist artist = (Artist) user;
            artist.verified = true;
            artist.persist();
        }

        return Response.ok(Map.of(
                "message", "Bluesky account added successfully",
                "profile", new SocialProfileDto(socialProfile)))
                .status(Response.Status.CREATED)
                .build();
    }

    @POST
    @Path("/link-bluesky")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response linkBlueskyAccount(BlueskyLinkRequest linkRequest) {
        Principal principal = identity.getPrincipal();
        if (principal == null || identity.isAnonymous()) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(new ErrorResponse("User not authenticated"))
                    .build();
        }

        String username = principal.getName();
        User user = User.findByUsername(username);

        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("User not found"))
                    .build();
        }

        SocialProfile blueskyProfile = user.socialProfiles.stream()
                .filter(profile -> "bluesky".equals(profile.platform))
                .findFirst()
                .orElseGet(() -> {
                    SocialProfile newProfile = new SocialProfile();
                    newProfile.platform = "bluesky";
                    newProfile.user = user;
                    user.socialProfiles.add(newProfile);
                    return newProfile;
                });

        blueskyProfile.username = linkRequest.blueskyHandle;
        blueskyProfile.profileUrl = "https://bsky.app/profile/" + linkRequest.blueskyHandle;
        blueskyProfile.did = linkRequest.blueskyDid;
        blueskyProfile.displayName = linkRequest.blueskyDisplayName;
        blueskyProfile.isVerified = true;

        user.persist();

        if ("artist".equals(user.role)) {
            Artist artist = (Artist) user;
            artist.verified = true;
            artist.persist();
        }

        return Response.ok(new SuccessResponse("Bluesky account linked successfully")).build();
    }

    @DELETE
    @Path("/{username}/social/{platform}/{accountUsername}")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response unlinkSocialAccount(
            @PathParam("username") String username,
            @PathParam("platform") String platform,
            @PathParam("accountUsername") String accountUsername) {

        Response validation = validateUserExists(username);
        if (validation != null) return validation;
        
        validation = validateOwnership(username);
        if (validation != null) return validation;

        User user = User.findByUsername(username);
        SocialProfile profileToRemove = user.socialProfiles.stream()
                .filter(profile -> profile.platform.equalsIgnoreCase(platform) &&
                        profile.username.equalsIgnoreCase(accountUsername))
                .findFirst()
                .orElse(null);

        if (profileToRemove == null) {
            return errorResponse(Response.Status.NOT_FOUND, "Social account not found");
        }

        boolean wasVerifiedBluesky = "bluesky".equalsIgnoreCase(platform) && profileToRemove.isVerified;

        user.socialProfiles.remove(profileToRemove);
        SocialProfile.delete("id", profileToRemove.id);
        user.persist();

        if ("artist".equals(user.role) && wasVerifiedBluesky) {
            Artist artist = (Artist) user;
            boolean hasOtherVerifiedBluesky = user.socialProfiles.stream()
                    .anyMatch(profile -> "bluesky".equalsIgnoreCase(profile.platform) && profile.isVerified);

            if (!hasOtherVerifiedBluesky) {
                artist.verified = false;
                artist.persist();
            }
        }

        return successResponse("Social account unlinked successfully");
    }

    @POST
    @Path("/{username}/tags/add")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response addTagToArtist(@PathParam("username") String username, Map<String, String> request) {
        Response validation = validateArtistExists(username);
        if (validation != null) return validation;
        
        validation = validateOwnership(username);
        if (validation != null) return validation;

        String tagName = request.get("tagName");
        if (tagName == null || tagName.trim().isEmpty()) {
            return errorResponse(Response.Status.BAD_REQUEST, "Tag name must be provided");
        }

        Tag tag = Tag.findByName(tagName);
        if (tag == null) {
            return errorResponse(Response.Status.NOT_FOUND, "Tag '" + tagName + "' not found");
        }

        Artist artist = (Artist) User.findByUsername(username);
        artist.addTag(tag);

        return successResponse("Tag '" + tagName + "' added successfully");
    }

    @DELETE
    @Path("/{username}/tags/{tagName}")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response removeTagFromArtist(@PathParam("username") String username, @PathParam("tagName") String tagName) {
        Response validation = validateArtistExists(username);
        if (validation != null) return validation;
        
        validation = validateOwnership(username);
        if (validation != null) return validation;

        Tag tag = Tag.findByName(tagName);
        if (tag == null) {
            return errorResponse(Response.Status.NOT_FOUND, "Tag '" + tagName + "' not found on this artist or system");
        }

        Artist artist = (Artist) User.findByUsername(username);

        if (artist.relatedTags == null || !artist.relatedTags.contains(tag)) {
            return errorResponse(Response.Status.NOT_FOUND, "Tag '" + tagName + "' not associated with this artist");
        }
        artist.removeTag(tag);

        return successResponse("Tag '" + tagName + "' removed successfully");
    }

    @PUT
    @Path("/{username}/commission-status")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response updateCommissionStatus(@PathParam("username") String username, Map<String, Boolean> request) {
        Response validation = validateArtistExists(username);
        if (validation != null) return validation;
        
        validation = validateOwnership(username);
        if (validation != null) return validation;

        Boolean isOpen = request.get("isOpen");
        if (isOpen == null) {
            return errorResponse(Response.Status.BAD_REQUEST, "Missing 'isOpen' field in request body");
        }

        Artist artist = (Artist) User.findByUsername(username);
        artist.setOpenForCommissions(isOpen);

        return Response.ok(Map.of(
                "message", "Commission status updated successfully",
                "isOpenForCommissions", artist.isOpenForCommissions)).build();
    }

    // Static inner classes for request/response bodies
    public static class BlueskyLinkRequest {
        public String blueskyDid;
        public String blueskyHandle;
        public String blueskyDisplayName;
    }

    public static class ErrorResponse {
        public String message;

        public ErrorResponse(String message) {
            this.message = message;
        }
    }

    public static class SuccessResponse {
        public String message;

        public SuccessResponse(String message) {
            this.message = message;
        }
    }
}