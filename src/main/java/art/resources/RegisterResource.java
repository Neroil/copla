package art.resources;

import art.dtos.UserRegistrationDto;
import art.entities.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.Map; // For simple JSON response

@Path("/register") // Changed path
@ApplicationScoped // Make it a bean
public class RegisterResource {

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response registerUser(UserRegistrationDto registrationData) {

        if (registrationData.name == null || registrationData.name.isBlank() ||
                registrationData.password == null || registrationData.password.isBlank() ||
                registrationData.email == null || registrationData.email.isBlank()) { // Added email check
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("message", "Username, email, and password cannot be empty."))
                    .build();
        }

        if (User.existsName(registrationData.name) || User.existsEmail(registrationData.email)) {
            return Response.status(Response.Status.CONFLICT)
                    .entity(Map.of("message", "UserProfile already exists!"))
                    .build();
        }

        try {
            if (registrationData.isArtist) {
                // Create artist account
                art.entities.Artist.add(
                        registrationData.name,
                        registrationData.password,
                        registrationData.email,
                        false // Start as unverified artist
                );
            } else {
                // Create regular user account
                User.add(registrationData.name, registrationData.password, registrationData.email);
            }
        } catch (Exception e) {
            // Log the exception e
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Map.of("message", "Failed to register user due to a server error."))
                    .build();
        }

        return Response.status(Response.Status.CREATED) // Use CREATED status for success
                .entity(Map.of("message", "UserProfile registered successfully!"))
                .build();
    }
}