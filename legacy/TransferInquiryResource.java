package id.testbank.legacy.transfer;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * SYNTHETIC workshop prop. Not compiled. Not served. No real accounts.
 *
 * Block #3 talking point: a javax.* (Java EE 8) resource waiting for a
 * jakarta.* (Jakarta EE 10) rename — the same shape of work as migrating
 * this repo from legacyResponse.js to envelope.js.
 *
 * See legacy/README.md and demo/WORKSHOP.md.
 */
@Path("/legacy/transfers")
public class TransferInquiryResource {

    @GET
    @Path("/{accountId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getHistory(@PathParam("accountId") String accountId) {
        // Narrative only. The live API is Node: GET /api/transfers/:accountId
        String body = "{\"status\":\"NOT_IMPLEMENTED\",\"accountId\":\"" + accountId + "\"}";
        return Response.status(501).entity(body).build();
    }
}
