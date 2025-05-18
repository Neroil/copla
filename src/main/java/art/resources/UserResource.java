package art.resources;

import art.dtos.SocialProfileDto;
import art.dtos.UserDto;
import art.entities.User;
import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

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

        if (!username.equals(identity.getPrincipal().getName())) {
            return Response.status(Response.Status.FORBIDDEN)
                    .entity(Map.of("message", "You are not allowed to add a social profile for this user"))
                    .build();
        }

        var socialProfile = new art.entities.SocialProfile();
        socialProfile.platform = "bluesky";
        socialProfile.username = socialProfileDto.username;
        socialProfile.profileUrl = socialProfileDto.profileUrl;
        socialProfile.isVerified = socialProfileDto.isVerified;
        socialProfile.user = user;

        user.socialProfiles.add(socialProfile);
        user.persist();

        // Return DTO instead of entity to avoid lazy loading issues
        SocialProfileDto resultDto = new SocialProfileDto();
        resultDto.platform = socialProfile.platform;
        resultDto.username = socialProfile.username;
        resultDto.profileUrl = socialProfile.profileUrl;
        resultDto.isVerified = socialProfile.isVerified;

        return Response.ok(resultDto).build();
    }

}

