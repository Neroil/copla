package art.services;

import art.entities.Artist;
import art.entities.User;
import art.utils.ResponseUtil;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;

import java.security.Principal;

@ApplicationScoped
public class ValidationService {

    @Inject
    SecurityIdentity identity;

    public Response validateUserExists(String username) {
        User user = User.findByUsername(username);
        if (user == null) {
            return ResponseUtil.errorResponse(Response.Status.NOT_FOUND, "User not found");
        }
        return null;
    }

    public Response validateArtistExists(String username) {
        User user = User.findByUsername(username);
        if (user == null || !"artist".equals(user.role)) {
            return ResponseUtil.errorResponse(Response.Status.NOT_FOUND, "Artist not found");
        }
        return null;
    }

    public Response validateOwnership(String username) {
        Principal principal = identity.getPrincipal();
        if (principal == null || !username.equals(principal.getName())) {
            return ResponseUtil.errorResponse(Response.Status.FORBIDDEN, "You can only modify your own account");
        }
        return null;
    }

    public Response validateCommissionCardExists(Artist artist) {
        if (artist.commissionCard == null) {
            return ResponseUtil.errorResponse(Response.Status.NOT_FOUND, "Commission card not found");
        }
        return null;
    }
}
