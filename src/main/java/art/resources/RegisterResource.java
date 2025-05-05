package art.resources;

import art.entities.User;
import jakarta.enterprise.context.ApplicationScoped; // Use ApplicationScoped for injection/transaction management
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
    @Consumes(MediaType.APPLICATION_JSON) // Expect JSON
    @Produces(MediaType.APPLICATION_JSON) // Return JSON
    @Transactional // Manage transaction for User.add
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
                    .entity(Map.of("message", "User already exists!"))
                    .build();
        }

        try {
            User.add(registrationData.name, registrationData.password, "user", registrationData.email); // Added email

        } catch (Exception e) {
            // Log the exception e
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Map.of("message", "Failed to register user due to a server error."))
                    .build();
        }


        return Response.status(Response.Status.CREATED) // Use CREATED status for success
                .entity(Map.of("message", "User registered successfully!"))
                .build();
    }
}