package art.utils;

import jakarta.ws.rs.core.Response;
import java.util.Map;

public class ResponseUtil {

    public static Response errorResponse(Response.Status status, String message) {
        return Response.status(status).entity(Map.of("message", message)).build();
    }

    public static Response successResponse(String message) {
        return Response.ok(Map.of("message", message)).build();
    }
}
