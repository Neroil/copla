package art.resources;

import art.dtos.ArtistDto;
import art.dtos.FollowingDto;
import art.dtos.UserDto;
import art.entities.Following;
import art.entities.Artist;
import art.entities.Tag;
import art.entities.User;
import art.entities.SocialProfile;
import art.services.ValidationService;
import art.utils.ResponseUtil;
import io.quarkus.runtime.annotations.RegisterForReflection;
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

    @Inject
    ValidationService validationService;

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
        Response validation = validationService.validateUserExists(username);
        if (validation != null)
            return validation;

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

    @POST
    @Path("/{username}/tags/add")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response addTagToArtist(@PathParam("username") String username, Map<String, String> request) {
        Response validation = validationService.validateArtistExists(username);
        if (validation != null)
            return validation;

        validation = validationService.validateOwnership(username);
        if (validation != null)
            return validation;

        String tagName = request.get("tagName");
        if (tagName == null || tagName.trim().isEmpty()) {
            return ResponseUtil.errorResponse(Response.Status.BAD_REQUEST, "Tag name must be provided");
        }

        Tag tag = Tag.findByName(tagName);
        if (tag == null) {
            return ResponseUtil.errorResponse(Response.Status.NOT_FOUND, "Tag '" + tagName + "' not found");
        }

        Artist artist = (Artist) User.findByUsername(username);
        artist.addTag(tag);

        return ResponseUtil.successResponse("Tag '" + tagName + "' added successfully");
    }

    @DELETE
    @Path("/{username}/tags/{tagName}")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response removeTagFromArtist(@PathParam("username") String username, @PathParam("tagName") String tagName) {
        Response validation = validationService.validateArtistExists(username);
        if (validation != null)
            return validation;

        validation = validationService.validateOwnership(username);
        if (validation != null)
            return validation;

        Tag tag = Tag.findByName(tagName);
        if (tag == null) {
            return ResponseUtil.errorResponse(Response.Status.NOT_FOUND,
                    "Tag '" + tagName + "' not found on this artist or system");
        }

        Artist artist = (Artist) User.findByUsername(username);

        if (artist.relatedTags == null || !artist.relatedTags.contains(tag)) {
            return ResponseUtil.errorResponse(Response.Status.NOT_FOUND,
                    "Tag '" + tagName + "' not associated with this artist");
        }
        artist.removeTag(tag);

        return ResponseUtil.successResponse("Tag '" + tagName + "' removed successfully");
    }

    @PUT
    @Path("/{username}/commission-status")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response updateCommissionStatus(@PathParam("username") String username, Map<String, Boolean> request) {
        Response validation = validationService.validateArtistExists(username);
        if (validation != null)
            return validation;

        validation = validationService.validateOwnership(username);
        if (validation != null)
            return validation;

        Boolean isOpen = request.get("isOpen");
        if (isOpen == null) {
            return ResponseUtil.errorResponse(Response.Status.BAD_REQUEST, "Missing 'isOpen' field in request body");
        }

        Artist artist = (Artist) User.findByUsername(username);
        artist.setOpenForCommissions(isOpen);

        return Response.ok(Map.of(
                "message", "Commission status updated successfully",
                "isOpenForCommissions", artist.isOpenForCommissions)).build();
    }

    @GET
    @Path("/{username}/following")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFollowing(@PathParam("username") String username,
            @QueryParam("openOnly") Boolean openOnly) {
        Response validation = validationService.validateUserExists(username);
        if (validation != null)
            return validation;

        validation = validationService.validateOwnership(username);
        if (validation != null)
            return validation;

        User user = User.findByUsername(username);

        List<Following> followingList;
        if (openOnly != null && openOnly) {
            followingList = Following.findOpenForCommissions(user);
        } else {
            followingList = Following.findByFollower(user);
        }

        var followingDtos = followingList.stream()
                .map(FollowingDto::new)
                .toList();

        return Response.ok(followingDtos).build();
    }

    @POST
    @Path("/{username}/sync-bluesky-following")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response syncBlueskyFollowing(@PathParam("username") String username,
            BlueskyFollowingRequest request) {
        Response validation = validationService.validateUserExists(username);
        if (validation != null)
            return validation;

        validation = validationService.validateOwnership(username);
        if (validation != null)
            return validation;

        User user = User.findByUsername(username);

        if (request.following == null) {
            return ResponseUtil.errorResponse(Response.Status.BAD_REQUEST, "No following data provided");
        }

        // Clear all existing following entries for this user
        Following.deleteByFollower(user);

        int syncedCount = 0;
        int linkedCount = 0;

        // Rebuild the following list from scratch
        for (BlueskyFollowingRequest.BlueskyUser followedUser : request.following) {
            Following.createOrUpdate(user, followedUser.handle, followedUser.did, followedUser.displayName);
            syncedCount++;

            Following following = Following.findByFollowerAndHandle(user, followedUser.handle);
            if (following != null && following.followed != null) {
                linkedCount++;
            }
        }

        return Response.ok(Map.of(
                "message", "Bluesky following rebuilt successfully",
                "syncedCount", syncedCount,
                "linkedCount", linkedCount)).build();
    }

    @GET
    @Path("/artists/following")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFollowedArtists(@QueryParam("verified") Boolean verified,
            @QueryParam("openForCommissions") Boolean openForCommissions) {
        Principal principal = identity.getPrincipal();
        if (principal == null || identity.isAnonymous()) {
            return ResponseUtil.errorResponse(Response.Status.UNAUTHORIZED, "Authentication required");
        }

        User user = User.findByUsername(principal.getName());
        if (user == null) {
            return ResponseUtil.errorResponse(Response.Status.NOT_FOUND, "User not found");
        }

        List<Following> followingList = Following.findByFollower(user);
        List<Artist> followedArtists = followingList.stream()
                .filter(f -> f.followed != null && "artist".equals(f.followed.role))
                .map(f -> (Artist) f.followed)
                .filter(artist -> {
                    boolean matchesVerified = verified == null || artist.verified == verified;
                    boolean matchesCommissions = openForCommissions == null
                            || artist.isOpenForCommissions == openForCommissions;
                    return matchesVerified && matchesCommissions;
                })
                .toList();

        var artistDtos = followedArtists.stream()
                .map(ArtistDto::new)
                .toList();

        return Response.ok(artistDtos).build();
    }

    @RegisterForReflection
    public static class BlueskyFollowingRequest {
        public List<BlueskyUser> following;

        @RegisterForReflection
        public static class BlueskyUser {
            public String handle;
            public String did;
            public String displayName;
        }
    }
}