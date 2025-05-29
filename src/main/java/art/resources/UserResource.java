package art.resources;

import art.dtos.ArtistDto;
import art.dtos.CommissionCardDto;
import art.dtos.SocialProfileDto;
import art.dtos.UserDto;
import art.entities.Artist;
import art.entities.CommissionCard;
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
import java.util.List;
import java.util.Map;

@Path("/users")
public class UserResource {

    @Inject
    SecurityIdentity identity;

    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllUsers() {
        // Map every user to UserDto using the refactored UserDto constructor
        var users = User.findAllUsers().stream()
                        .map(UserDto::new) // UserDto constructor will handle the mapping
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

        // Map to DTOs using the refactored ArtistDto constructor
        var artistDtos = artists.stream()
                .map(ArtistDto::new) // ArtistDto constructor will handle the mapping
                .toList();

        return Response.ok(artistDtos).build();
    }

    @GET
    @Path("/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUser(@PathParam("username") String username) {
        User user = User.findByUsername(username);

        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "User not found"))
                    .build();
        }

        // Conditionally return ArtistDto or UserDto
        if ("artist".equals(user.role)) {
            Artist artist = (Artist) user;
            ArtistDto artistDto = new ArtistDto(artist); // Use the refactored ArtistDto
            return Response.ok(artistDto).build();
        } else {
            UserDto userDto = new UserDto(user); // Use the refactored UserDto
            return Response.ok(userDto).build();
        }
    }

    // ... other methods remain the same, ensuring they use the correct DTOs if applicable ...
    // For example, addBluesky, linkBlueskyAccount, commission card methods, tag methods, etc.
    // primarily deal with entities or specific DTOs like SocialProfileDto,
    // so they might not need changes unless they were directly constructing UserDto/ArtistDto
    // in a way that's now simplified by the new constructors.

    @POST
    @Path("/{username}/social/bluesky")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response addBluesky(@PathParam("username") String username, SocialProfileDto socialProfileDto) {
        User user = User.findByUsername(username);
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "User not found"))
                    .build();
        }

        Principal principal = identity.getPrincipal();
        if (!username.equals(principal.getName())) {
            return Response.status(Response.Status.FORBIDDEN)
                    .entity(Map.of("message", "You can only modify your own account"))
                    .build();
        }

        SocialProfile socialProfile = new SocialProfile();
        socialProfile.platform = "bluesky";
        socialProfile.username = socialProfileDto.username;
        socialProfile.profileUrl = "https://bsky.app/profile/" + socialProfileDto.username;
        socialProfile.isVerified = socialProfileDto.isVerified; // Assuming SocialProfileDto has isVerified
        socialProfile.user = user;

        user.socialProfiles.add(socialProfile);
        socialProfile.persist(); // Persist the new social profile

        // It's good practice to return the created/updated DTO
        return Response.ok(Map.of(
                "message", "Bluesky account added successfully",
                "profile", new SocialProfileDto(socialProfile))) // Use SocialProfileDto constructor
                .status(Response.Status.CREATED) // Or OK if preferred
                .build();
    }
    
    // Ensure BlueskyLinkRequest, ErrorResponse, SuccessResponse are defined as before or adjusted if needed.
    // For brevity, the rest of the UserResource methods are omitted but should be reviewed for consistency.
    // Generally, the changes above are the most critical for the DTO refactoring.


    @POST
    @Path("/link-bluesky")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response linkBlueskyAccount(
            BlueskyLinkRequest linkRequest) {

        Principal principal = identity.getPrincipal();
        if (principal == null || identity.isAnonymous()) { // Check for anonymous explicitly as well
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(new ErrorResponse("User not authenticated")) // Corrected typo from "authenticatedd"
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
                    user.socialProfiles.add(newProfile); // Add to the list before persisting user
                    return newProfile;
                });

        blueskyProfile.username = linkRequest.blueskyHandle;
        blueskyProfile.profileUrl = "https://bsky.app/profile/" + linkRequest.blueskyHandle;
        blueskyProfile.did = linkRequest.blueskyDid; // Assuming SocialProfile entity has 'did' and 'displayName'
        blueskyProfile.displayName = linkRequest.blueskyDisplayName;
        blueskyProfile.isVerified = true; 

        // No need to persist blueskyProfile separately if CascadeType.ALL or PERSIST is on User.socialProfiles
        // and blueskyProfile is managed by the User entity. User.persist() should handle it.
        user.persist();

        return Response.ok(new SuccessResponse("Bluesky account linked successfully")).build();
    }

    @GET
    @Path("/{username}/commission-card")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCommissionCard(@PathParam("username") String username) {
        User user = User.findByUsername(username);
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "User not found"))
                    .build();
        }

        if (!"artist".equals(user.role)) { // Simplified role check
            return Response.status(Response.Status.FORBIDDEN)
                    .entity(Map.of("message", "Only artists can have commission cards"))
                    .build();
        }

        Artist artist = (Artist) user;
        CommissionCard commissionCard = artist.commissionCard;
        if (commissionCard == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "Commission card not found"))
                    .build();
        }
        
        return Response.ok(new CommissionCardDto(commissionCard)).build();
    }

    @POST
    @Path("/{username}/commission-card")
    @Consumes(MediaType.APPLICATION_JSON) // Should be @Consumes if taking data, but this one creates an empty one.
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response createCommissionCard(@PathParam("username") String username /* Potentially CommissionCardDto cardDetails if creating with data */) {
        User user = User.findByUsername(username);
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "User not found"))
                    .build();
        }

        if (!"artist".equals(user.role)) {
            return Response.status(Response.Status.FORBIDDEN)
                    .entity(Map.of("message", "Only artists can have commission cards"))
                    .build();
        }
        
        // Add authorization check: is the logged-in user the same as {username}?
        Principal principal = identity.getPrincipal();
        if (principal == null || !username.equals(principal.getName())) {
            return Response.status(Response.Status.FORBIDDEN)
                    .entity(Map.of("message", "You can only create a commission card for your own artist profile."))
                    .build();
        }

        Artist artist = (Artist) user;
        if (artist.commissionCard != null) {
             return Response.status(Response.Status.CONFLICT) // Or BAD_REQUEST
                    .entity(Map.of("message", "Artist already has a commission card. Use PUT to update or DELETE first."))
                    .build();
        }

        CommissionCard commissionCard = new CommissionCard();
        // If commissionCardDetails were passed in request body, populate commissionCard here
        artist.commissionCard = commissionCard;
        commissionCard.artist = artist; // Set the bidirectional relationship if CommissionCard has an 'artist' field.
                                   // And if User.commissionCard is mappedBy "artist"
        
        // Panache ORM: If CommissionCard is owned by Artist (e.g. @OneToOne(mappedBy="artist")),
        // persisting artist should persist commissionCard if CascadeType.PERSIST or ALL.
        // If CommissionCard owns the relationship (i.e. has @JoinColumn for artist_id),
        // then commissionCard.persist() is needed.
        // Given Artist.commissionCard is @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true),
        // artist.persist() is sufficient after setting artist.commissionCard.
        // However, commissionCard.persist() also works if it's a new entity.
        
        commissionCard.persist(); // Explicitly persist the new card
        artist.persist(); // Or just artist.persist() if cascade is set up from Artist to CommissionCard

        return Response.status(Response.Status.CREATED)
                       .entity(new CommissionCardDto(commissionCard))
                       .build();
    }

    @DELETE
    @Path("/{username}/commission-card")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response deleteCommissionCard(@PathParam("username") String username) {
        User user = User.findByUsername(username);
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "User not found"))
                    .build();
        }

        if (!"artist".equals(user.role)) {
            return Response.status(Response.Status.FORBIDDEN)
                    .entity(Map.of("message", "Only artists can have commission cards"))
                    .build();
        }
        
        // Add authorization check
        Principal principal = identity.getPrincipal();
        if (principal == null || !username.equals(principal.getName())) {
            return Response.status(Response.Status.FORBIDDEN)
                    .entity(Map.of("message", "You can only delete your own commission card."))
                    .build();
        }

        Artist artist = (Artist) user;
        CommissionCard commissionCard = artist.commissionCard;
        if (commissionCard == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "Commission card not found"))
                    .build();
        }

        artist.commissionCard = null; // This will trigger orphanRemoval if configured
        // commissionCard.delete(); // Not strictly necessary if orphanRemoval=true and artist.persist() is called
                                 // but explicit delete is also fine.
        artist.persist(); // Persist artist to save the nullification of the relationship

        return Response.ok(Map.of("message", "Commission card deleted successfully")).build();
    }

    @DELETE
    @Path("/{username}/social/{platform}/{accountUsername}")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response unlinkSocialAccount(
            @PathParam("username") String username,
            @PathParam("platform") String platform,
            @PathParam("accountUsername") String accountUsername) {

        User user = User.findByUsername(username);
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "User not found"))
                    .build();
        }

        Principal principal = identity.getPrincipal();
        if (principal == null || !username.equals(principal.getName())) { // Check for null principal
            return Response.status(Response.Status.FORBIDDEN)
                    .entity(Map.of("message", "You can only unlink accounts from your own profile"))
                    .build();
        }

        SocialProfile profileToRemove = user.socialProfiles.stream()
            .filter(profile -> profile.platform.equalsIgnoreCase(platform) &&
                               profile.username.equalsIgnoreCase(accountUsername))
            .findFirst()
            .orElse(null);

        if (profileToRemove == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "Social account not found"))
                    .build();
        }

        user.socialProfiles.remove(profileToRemove);
        // profileToRemove.delete(); // Not needed if User.socialProfiles has orphanRemoval=true and User is persisted
                                   // However, explicit delete is safer if unsure about cascade/orphan config.
                                   // Given SocialProfile.user is the owning side (mappedBy="user" on User.socialProfiles),
                                   // explicit deletion or proper cascade from User is needed.
                                   // If orphanRemoval=true on @OneToMany on User.socialProfiles, removing from list + persisting user works.
        SocialProfile.delete("id", profileToRemove.id); // Or profileToRemove.delete() if it's a PanacheEntity.
                                                        // Assuming SocialProfile is a PanacheEntity.

        user.persist(); // Persist user to save changes to the socialProfiles list

        return Response.ok(Map.of("message", "Social account unlinked successfully")).build();
    }

    @POST
    @Path("/{username}/tags/add")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response addTagToArtist(@PathParam("username") String username, Map<String, String> request) {
        User user = User.findByUsername(username);
        if (user == null || !"artist".equals(user.role)) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "Artist not found"))
                    .build();
        }

        Principal principal = identity.getPrincipal();
        if (principal == null || !username.equals(principal.getName())) {
            return Response.status(Response.Status.FORBIDDEN)
                    .entity(Map.of("message", "You can only modify your own tags"))
                    .build();
        }

        String tagName = request.get("tagName");
        if (tagName == null || tagName.trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("message", "Tag name must be provided"))
                    .build();
        }

        Tag tag = Tag.findByName(tagName);
        if (tag == null) {
            // Option: Create tag if it doesn't exist, or return NOT_FOUND
            // For now, assume tags must pre-exist or be managed elsewhere.
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "Tag '" + tagName + "' not found"))
                    .build();
        }

        Artist artist = (Artist) user;
        artist.addTag(tag); // This method in Artist.java already handles duplicates and persistence
        // artist.persist(); // The addTag method in Artist already calls persist.

        return Response.ok(Map.of("message", "Tag '" + tagName + "' added successfully")).build();
    }

    @DELETE
    @Path("/{username}/tags/{tagName}")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response removeTagFromArtist(@PathParam("username") String username, @PathParam("tagName") String tagName) {
        User user = User.findByUsername(username);
        if (user == null || !"artist".equals(user.role)) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "Artist not found"))
                    .build();
        }

        Principal principal = identity.getPrincipal();
        if (principal == null || !username.equals(principal.getName())) {
            return Response.status(Response.Status.FORBIDDEN)
                    .entity(Map.of("message", "You can only modify your own tags"))
                    .build();
        }

        Tag tag = Tag.findByName(tagName);
        if (tag == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "Tag '" + tagName + "' not found on this artist or system")) // Clarify message
                    .build();
        }

        Artist artist = (Artist) user;
        
        if (artist.relatedTags == null || !artist.relatedTags.contains(tag)) {
             return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "Tag '" + tagName + "' not associated with this artist"))
                    .build();
        }
        artist.removeTag(tag); // This method in Artist.java already handles persistence
        // artist.persist(); // The removeTag method in Artist already calls persist.

        return Response.ok(Map.of("message", "Tag '" + tagName + "' removed successfully")).build();
    }

    @PUT
    @Path("/{username}/commission-status")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response updateCommissionStatus(@PathParam("username") String username, Map<String, Boolean> request) {
        User user = User.findByUsername(username);
        if (user == null || !"artist".equals(user.role)) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "Artist not found"))
                    .build();
        }

        Principal principal = identity.getPrincipal();
        if (principal == null || !username.equals(principal.getName())) {
            return Response.status(Response.Status.FORBIDDEN)
                    .entity(Map.of("message", "You can only modify your own commission status"))
                    .build();
        }

        Boolean isOpen = request.get("isOpen");
        if (isOpen == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("message", "Missing 'isOpen' field in request body"))
                    .build();
        }

        Artist artist = (Artist) user;
        artist.setOpenForCommissions(isOpen); // This method in Artist.java already handles persistence
        // artist.persist(); // The setOpenForCommissions method in Artist already calls persist.

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
        public ErrorResponse(String message) { this.message = message; }
    }

    public static class SuccessResponse {
        public String message;
        public SuccessResponse(String message) { this.message = message; }
    }
}