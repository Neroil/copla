package art.resources;

import art.dtos.UserDto;
import art.entities.User;
import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
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
            return userDto;
        }).toList();

        return Response.ok(users).build();
    }

    @GET
    @Path("/me")
    public Response me() {
        if (identity.isAnonymous()) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
        String username = identity.getPrincipal().getName();
        return Response.ok(Map.of("username", username)).build();
    }

    @GET
    @Path("/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUser(@PathParam("userId") String userId) {
        User user = User.findById(Long.valueOf(userId));

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

        return Response.ok(userDto).build();
    }

}
