package art.resources;

import java.util.List;

import art.dtos.TagDto;
import art.entities.Tag;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/tags")
public class TagResource {

    
    
    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllTags(@QueryParam("category") String category) {
        List<Tag> tags;
        
        if (category != null && !category.isEmpty()) {
            tags = Tag.findByCategory(category);
        } else {
            tags = Tag.findAllActiveTags();
        }
        
        var tagDtos = tags.stream()
            .map(TagDto::new)
            .toList();
        
        return Response.ok(tagDtos).build();
    }
    
    @GET
    @Path("/names")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllTagNames() {
        List<String> tagNames = Tag.getAllTagNames();
        return Response.ok(tagNames).build();
    }
}
