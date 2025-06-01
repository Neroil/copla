package art.resources;

import art.dtos.SocialProfileDto;
import art.entities.Artist;
import art.entities.SocialProfile;
import art.entities.User;
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
import java.util.Base64;
import java.util.Map;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@Path("/users")
public class SocialProfileResource {

    @Inject
    ValidationService validationService;

    @Inject
    SecurityIdentity identity;

    @ConfigProperty(name = "app.encryption.key", defaultValue = "defaultkey123456")
    String encryptionKey;

    @POST
    @Path("/{username}/social/bluesky")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response addBluesky(@PathParam("username") String username, SocialProfileDto socialProfileDto) {
        Response validation = validationService.validateUserExists(username);
        if (validation != null)
            return validation;

        validation = validationService.validateOwnership(username);
        if (validation != null)
            return validation;

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
        
        // Store sync capabilities
        if (linkRequest.sessionData != null && !linkRequest.sessionData.trim().isEmpty()) {
            try {
                blueskyProfile.encryptedSessionData = encryptSessionData(linkRequest.sessionData);
                blueskyProfile.canSync = true;
                System.out.println("Successfully encrypted and stored session data for user: " + username);
            } catch (Exception e) {
                System.err.println("Failed to encrypt session data for user " + username + ": " + e.getMessage());
                e.printStackTrace();
                // Still save the profile but without sync capabilities
                blueskyProfile.canSync = false;
            }
        } else {
            System.out.println("No session data provided for user: " + username);
            blueskyProfile.canSync = false;
        }

        blueskyProfile.persist();
        user.persist();

        if ("artist".equals(user.role)) {
            Artist artist = (Artist) user;
            artist.verified = true;
            artist.persist();
        }

        return Response.ok(new SuccessResponse("Bluesky account linked successfully")).build();
    }

    @GET
    @Path("/{username}/bluesky-session")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getBlueskySessionForSync(@PathParam("username") String username) {
        Response validation = validationService.validateUserExists(username);
        if (validation != null) return validation;

        validation = validationService.validateOwnership(username);
        if (validation != null) return validation;

        User user = User.findByUsername(username);
        
        // Find Bluesky profile with sync capabilities
        SocialProfile blueskyProfile = user.socialProfiles.stream()
                .filter(profile -> "bluesky".equals(profile.platform) && profile.isVerified)
                .findFirst()
                .orElse(null);

        if (blueskyProfile == null) {
            return ResponseUtil.errorResponse(Response.Status.NOT_FOUND, 
                "No verified Bluesky account found");
        }

        if (!blueskyProfile.canSync || blueskyProfile.encryptedSessionData == null) {
            return ResponseUtil.errorResponse(Response.Status.NOT_FOUND, 
                "No Bluesky account with sync capabilities found. Please re-verify your account to enable sync.");
        }

        try {
            String sessionData = decryptSessionData(blueskyProfile.encryptedSessionData);
            return Response.ok(Map.of(
                "sessionData", sessionData,
                "message", "Session data retrieved for sync"
            )).build();
        } catch (Exception e) {
            System.err.println("Failed to decrypt session data for user " + username + ": " + e.getMessage());
            return ResponseUtil.errorResponse(Response.Status.INTERNAL_SERVER_ERROR, 
                "Failed to retrieve sync credentials. Please re-verify your account.");
        }
    }

    private String encryptSessionData(String data) throws Exception {
        SecretKeySpec keySpec = new SecretKeySpec(encryptionKey.getBytes(), "AES");
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.ENCRYPT_MODE, keySpec);
        byte[] encrypted = cipher.doFinal(data.getBytes());
        return Base64.getEncoder().encodeToString(encrypted);
    }

    private String decryptSessionData(String encryptedData) throws Exception {
        SecretKeySpec keySpec = new SecretKeySpec(encryptionKey.getBytes(), "AES");
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.DECRYPT_MODE, keySpec);
        byte[] decrypted = cipher.doFinal(Base64.getDecoder().decode(encryptedData));
        return new String(decrypted);
    }

    @DELETE
    @Path("/{username}/social/{platform}/{accountUsername}")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response unlinkSocialAccount(
            @PathParam("username") String username,
            @PathParam("platform") String platform,
            @PathParam("accountUsername") String accountUsername) {

        Response validation = validationService.validateUserExists(username);
        if (validation != null)
            return validation;

        validation = validationService.validateOwnership(username);
        if (validation != null)
            return validation;

        User user = User.findByUsername(username);
        SocialProfile profileToRemove = user.socialProfiles.stream()
                .filter(profile -> profile.platform.equalsIgnoreCase(platform) &&
                        profile.username.equalsIgnoreCase(accountUsername))
                .findFirst()
                .orElse(null);

        if (profileToRemove == null) {
            return ResponseUtil.errorResponse(Response.Status.NOT_FOUND, "Social account not found");
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

        return ResponseUtil.successResponse("Social account unlinked successfully");
    }

    @RegisterForReflection
    public static class BlueskyLinkRequest {
        public String blueskyDid;
        public String blueskyHandle;
        public String blueskyDisplayName;
        public String sessionData; // For storing sync capabilities
    }

    @RegisterForReflection
    public static class ErrorResponse {
        public String message;

        public ErrorResponse(String message) {
            this.message = message;
        }
    }

    @RegisterForReflection
    public static class SuccessResponse {
        public String message;

        public SuccessResponse(String message) {
            this.message = message;
        }
    }
}
