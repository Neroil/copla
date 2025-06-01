package art.resources;

import art.dtos.CommissionCardDto;
import art.dtos.CommissionCardElementDto;
import art.entities.Artist;
import art.entities.CommissionCard;
import art.entities.CommissionCardElement;
import art.entities.User;
import art.services.ValidationService;
import art.utils.ResponseUtil;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Path("/users/{username}/commission-card")
public class CommissionCardResource {

    @Inject
    ValidationService validationService;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCommissionCard(@PathParam("username") String username) {
        Response validation = validationService.validateArtistExists(username);
        if (validation != null)
            return validation;

        Artist artist = (Artist) User.findByUsername(username);
        validation = validationService.validateCommissionCardExists(artist);
        if (validation != null)
            return validation;

        return Response.ok(new CommissionCardDto(artist.commissionCard)).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response createCommissionCard(@PathParam("username") String username, CommissionCardDto cardDetails) {
        Response validation = validationService.validateArtistExists(username);
        if (validation != null)
            return validation;

        validation = validationService.validateOwnership(username);
        if (validation != null)
            return validation;

        Artist artist = (Artist) User.findByUsername(username);
        if (artist.commissionCard != null) {
            return ResponseUtil.errorResponse(Response.Status.CONFLICT,
                    "Artist already has a commission card. Use PUT to update or DELETE first.");
        }

        CommissionCard commissionCard = new CommissionCard();
        commissionCard.title = cardDetails.title;
        commissionCard.description = cardDetails.description;
        commissionCard.elements = new ArrayList<>();

        artist.commissionCard = commissionCard;
        commissionCard.artist = artist;

        commissionCard.persist();
        artist.persist();

        return Response.status(Response.Status.CREATED)
                .entity(new CommissionCardDto(commissionCard))
                .build();
    }

    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response deleteCommissionCard(@PathParam("username") String username) {
        Response validation = validationService.validateArtistExists(username);
        if (validation != null)
            return validation;

        validation = validationService.validateOwnership(username);
        if (validation != null)
            return validation;

        Artist artist = (Artist) User.findByUsername(username);
        validation = validationService.validateCommissionCardExists(artist);
        if (validation != null)
            return validation;

        artist.commissionCard = null;
        artist.persist();

        return ResponseUtil.successResponse("Commission card deleted successfully");
    }

    @POST
    @Path("/elements")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response createCommissionCardElement(@PathParam("username") String username,
            CommissionCardElementDto elementDto) {
        Response validation = validationService.validateArtistExists(username);
        if (validation != null)
            return validation;

        validation = validationService.validateOwnership(username);
        if (validation != null)
            return validation;

        Artist artist = (Artist) User.findByUsername(username);
        validation = validationService.validateCommissionCardExists(artist);
        if (validation != null)
            return validation;

        if (elementDto.title == null || elementDto.title.trim().isEmpty()) {
            return ResponseUtil.errorResponse(Response.Status.BAD_REQUEST, "Element title is required");
        }
        if (elementDto.description == null || elementDto.description.trim().isEmpty()) {
            return ResponseUtil.errorResponse(Response.Status.BAD_REQUEST, "Element description is required");
        }

        CommissionCardElement element = new CommissionCardElement();
        element.title = elementDto.title.trim();
        element.description = elementDto.description.trim();
        element.price = elementDto.price;
        element.exampleImageUrls = elementDto.exampleImageUrls != null ? new ArrayList<>(elementDto.exampleImageUrls)
                : new ArrayList<>();
        element.commissionCard = artist.commissionCard;

        artist.commissionCard.addElement(element);
        element.persist();
        artist.persist();

        return Response.status(Response.Status.CREATED)
                .entity(new CommissionCardElementDto(element))
                .build();
    }

    @PUT
    @Path("/elements/{elementId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response updateCommissionCardElement(
            @PathParam("username") String username,
            @PathParam("elementId") Long elementId,
            Map<String, Object> updates) {

        Response validation = validationService.validateArtistExists(username);
        if (validation != null)
            return validation;

        validation = validationService.validateOwnership(username);
        if (validation != null)
            return validation;

        Artist artist = (Artist) User.findByUsername(username);
        validation = validationService.validateCommissionCardExists(artist);
        if (validation != null)
            return validation;

        CommissionCardElement element = CommissionCardElement.findById(elementId);
        if (element == null || !element.commissionCard.id.equals(artist.commissionCard.id)) {
            return ResponseUtil.errorResponse(Response.Status.NOT_FOUND, "Commission card element not found");
        }

        if (updates.containsKey("price")) {
            Object priceValue = updates.get("price");
            if (priceValue instanceof Number) {
                element.price = ((Number) priceValue).doubleValue();
            } else if (priceValue == null) {
                element.price = null;
            }
        }

        if (updates.containsKey("exampleImageUrls")) {
            Object imageUrls = updates.get("exampleImageUrls");
            if (imageUrls instanceof List) {
                element.exampleImageUrls = (List<String>) imageUrls;
            }
        }

        if (updates.containsKey("title")) {
            element.title = (String) updates.get("title");
        }

        if (updates.containsKey("description")) {
            element.description = (String) updates.get("description");
        }

        element.persist();

        return ResponseUtil.successResponse("Commission card element updated successfully");
    }

    @DELETE
    @Path("/elements/{elementId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response deleteCommissionCardElement(
            @PathParam("username") String username,
            @PathParam("elementId") Long elementId) {

        Response validation = validationService.validateArtistExists(username);
        if (validation != null)
            return validation;

        validation = validationService.validateOwnership(username);
        if (validation != null)
            return validation;

        Artist artist = (Artist) User.findByUsername(username);
        validation = validationService.validateCommissionCardExists(artist);
        if (validation != null)
            return validation;

        CommissionCardElement element = CommissionCardElement.findById(elementId);
        if (element == null || !element.commissionCard.id.equals(artist.commissionCard.id)) {
            return ResponseUtil.errorResponse(Response.Status.NOT_FOUND, "Commission card element not found");
        }

        artist.commissionCard.removeElement(element);
        element.delete();
        artist.persist();

        return ResponseUtil.successResponse("Commission card element deleted successfully");
    }
}
