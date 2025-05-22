package art.resources;

import art.dtos.CommissionCardDto;
import art.dtos.SocialProfileDto;
import art.dtos.UserDto;
import art.entities.Artist;
import art.entities.CommissionCard;
import art.entities.SocialProfile;
import art.entities.User;
import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.security.Principal;
import java.util.Map;

@Path("/users")
public class UserResource {

    @Inject
    SecurityIdentity identity;

    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllUsers() {

        // Map every user to UserDto
        var users = User.findAllUsers().stream().map(user -> {
            UserDto userDto = new UserDto();
            userDto.id = user.id;
            userDto.name = user.name;
            userDto.email = user.email;
            userDto.timeCreated = user.timeCreated;
            userDto.profilePicPath = user.profilePicPath;
            return userDto;
        }).toList();

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
    @Path("/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUser(@PathParam("username") String username) {
        User user = User.findByUsername(username);

        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "User not found"))
                    .build();
        }

        UserDto userDto = new UserDto();
        userDto.id = user.id;
        userDto.name = user.name;
        userDto.email = user.email;
        userDto.timeCreated = user.timeCreated;
        userDto.profilePicPath = user.profilePicPath;
        userDto.bio = user.bio;
        userDto.role = user.role;
        userDto.socialProfiles = user.socialProfiles.stream().map(socialProfile -> {
            var socialProfileDto = new SocialProfileDto();
            socialProfileDto.platform = socialProfile.platform;
            socialProfileDto.username = socialProfile.username;
            socialProfileDto.profileUrl = socialProfile.profileUrl;
            socialProfileDto.isVerified = socialProfile.isVerified;
            return socialProfileDto;
        }).toArray(SocialProfileDto[]::new);

        return Response.ok(userDto).build();
    }

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

        // Verify current user is authorized to modify this user's profile
        Principal principal = identity.getPrincipal();
        if (!username.equals(principal.getName())) {
            return Response.status(Response.Status.FORBIDDEN)
                    .entity(Map.of("message", "You can only modify your own account"))
                    .build();
        }

        // Create the new social profile
        SocialProfile socialProfile = new SocialProfile();
        socialProfile.platform = "bluesky";
        socialProfile.username = socialProfileDto.username;
        socialProfile.profileUrl = "https://bsky.app/profile/" + socialProfileDto.username;
        socialProfile.isVerified = socialProfileDto.isVerified;
        socialProfile.user = user;

        // Add to user's social profiles
        user.socialProfiles.add(socialProfile);
        socialProfile.persist();

        return Response.ok(Map.of(
                "message", "Bluesky account added successfully",
                "profile", new SocialProfileDto(socialProfile))).build();
    }

    @POST
    @Path("/link-bluesky")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response linkBlueskyAccount(
            BlueskyLinkRequest linkRequest) {

        Principal principal = identity.getPrincipal();
        if (principal == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(new ErrorResponse("User not authenticatedd"))
                    .build();
        }

        String username = principal.getName();
        User user = User.findByUsername(username);

        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("User not found"))
                    .build();
        }

        // Check if user already has a Bluesky profile
        boolean hasBluesky = user.socialProfiles.stream()
                .anyMatch(profile -> "bluesky".equals(profile.platform));

        SocialProfile blueskyProfile;
        if (hasBluesky) {
            // Update existing profile
            blueskyProfile = user.socialProfiles.stream()
                    .filter(profile -> "bluesky".equals(profile.platform))
                    .findFirst().orElse(new SocialProfile());
        } else {
            // Create new profile
            blueskyProfile = new SocialProfile();
            blueskyProfile.platform = "bluesky";
            blueskyProfile.user = user;
            user.socialProfiles.add(blueskyProfile);
        }

        // Update profile details
        blueskyProfile.username = linkRequest.blueskyHandle;
        blueskyProfile.profileUrl = "https://bsky.app/profile/" + linkRequest.blueskyHandle;
        blueskyProfile.did = linkRequest.blueskyDid;
        blueskyProfile.displayName = linkRequest.blueskyDisplayName;
        blueskyProfile.isVerified = true; // Mark as verified since we've confirmed via OAuth

        // Save changes
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

        if (user.role == null || !user.role.equals("artist")) {
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
        };

        return Response.ok(new CommissionCardDto(commissionCard)).build();
    }

    @POST
    @Path("/{username}/commission-card")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response createCommissionCard(@PathParam("username") String username){
        User user = User.findByUsername(username);
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "User not found"))
                    .build();
        }

        if (user.role == null || !user.role.equals("artist")) {
            return Response.status(Response.Status.FORBIDDEN)
                    .entity(Map.of("message", "Only artists can have commission cards"))
                    .build();
        }

        Artist artist = (Artist) user;
        CommissionCard commissionCard = new CommissionCard();
        artist.commissionCard = commissionCard;
        commissionCard.persist();

        return Response.ok(new CommissionCardDto(commissionCard)).build();
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

        if (user.role == null || !user.role.equals("artist")) {
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

        artist.commissionCard = null;
        commissionCard.delete();

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
        if (!username.equals(principal.getName())) {
            return Response.status(Response.Status.FORBIDDEN)
                    .entity(Map.of("message", "You can only unlink accounts from your own profile"))
                    .build();
        }

        // Find the specific social profile to remove
        SocialProfile profileToRemove = null;
        for (SocialProfile profile : user.socialProfiles) {
            if (profile.platform.equalsIgnoreCase(platform) &&
                    profile.username.equalsIgnoreCase(accountUsername)) {
                profileToRemove = profile;
                break;
            }
        }

        if (profileToRemove == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "Social account not found"))
                    .build();
        }

        // Remove the profile
        user.socialProfiles.remove(profileToRemove);
        profileToRemove.delete();

        return Response.ok(Map.of("message", "Social account unlinked successfully")).build();
    }

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
