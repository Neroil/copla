package art.resources;

import art.entities.User;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.jboss.logging.Logger;

@Path("/images")
@ApplicationScoped
public class ImageResource {

    @Inject
    SecurityIdentity identity;

    private static final Logger log = Logger.getLogger(ImageResource.class);

    private final String uploadDir;

    public ImageResource() {
        this.uploadDir = System.getProperty("user.dir") + "/uploads/images/";
        initUploadDirectory();
    }

    private void initUploadDirectory() {
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
    }

    private Response uploadImage(FileUpload file, String fileName) {
        try {
            java.nio.file.Path targetPath = Paths.get(uploadDir + fileName);

            Files.copy(file.uploadedFile(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            String imageUrl = "/api/images/view/" + fileName;
            return Response.ok().entity("{\"url\":\"" + imageUrl + "\"}").build();
        } catch (IOException e) {
            return Response.serverError().entity("{\"error\":\"" + e.getMessage() + "\"}").build();
        }
    }

    @POST
    @Path("/upload/profilepic")
    @Transactional
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response uploadProfilePicture(@RestForm("file") FileUpload file) {
        //Don't allow anyone to upload files
        if (identity.isAnonymous()) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }

        String username = identity.getPrincipal().getName();
        String fileName = username + "_" + UUID.randomUUID() + "_" + file.fileName();

        Response uploadResponse = uploadImage(file, fileName);


        log.info("Checking if image upload was successful " + uploadResponse.getStatus());

        if (uploadResponse.getStatus() == Response.Status.OK.getStatusCode()) {
            log.info("Image uploaded successfully");
            User user = User.findByUsername(username);
            if (user != null) {
                log.info("User found: " + user.name);
                user.profilePicPath = "/api/images/view/" + fileName;
                user.persist();
            }
        }

        return uploadResponse;
    }

    @POST
    @Path("/upload/userpic")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response uploadUserPicture(@RestForm("file") FileUpload file) {
        //Don't allow anyone to upload files
        if (identity.isAnonymous()) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }

        System.out.println(file.fileName());
        String fileName = identity.getPrincipal().getName() + "_" + UUID.randomUUID() + "_" + file.fileName();

        return uploadImage(file, fileName);
    }

    @DELETE
    @Path("/delete/{fileName}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteImage(@PathParam("fileName") String fileName) {
        if (identity.isAnonymous()) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }

        try {
            // Extract the actual filename from the URL path if it contains /api/images/view/
            String actualFileName = fileName;
            if (fileName.startsWith("/api/images/view/")) {
                actualFileName = fileName.substring("/api/images/view/".length());
            }

            java.nio.file.Path imagePath = Paths.get(uploadDir + actualFileName);
            if (!Files.exists(imagePath)) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("{\"error\":\"Image not found\"}")
                        .build();
            }

            // Check if the current user owns this image (basic security check)
            String currentUser = identity.getPrincipal().getName();
            if (!actualFileName.startsWith(currentUser + "_")) {
                return Response.status(Response.Status.FORBIDDEN)
                        .entity("{\"error\":\"You can only delete your own images\"}")
                        .build();
            }

            Files.delete(imagePath);
            return Response.ok()
                    .entity("{\"message\":\"Image deleted successfully\"}")
                    .build();
        } catch (IOException e) {
            return Response.serverError()
                    .entity("{\"error\":\"Failed to delete image: " + e.getMessage() + "\"}")
                    .build();
        }
    }

    @GET
    @Path("/view/{fileName}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response getImage(@PathParam("fileName") String fileName) {
        try {
            java.nio.file.Path imagePath = Paths.get(uploadDir + fileName);
            if (!Files.exists(imagePath)) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }

            byte[] imageData = Files.readAllBytes(imagePath);
            return Response.ok(imageData)
                    .header("Content-Disposition", "inline; filename=" + fileName)
                    .build();
        } catch (IOException e) {
            return Response.serverError().entity("{\"error\":\"" + e.getMessage() + "\"}").build();
        }
    }
}