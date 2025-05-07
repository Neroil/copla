package art.entities;
import io.quarkus.elytron.security.common.BcryptUtil;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.List;


@Entity
public class Artist extends User {
    public boolean verified;

    @OneToMany
    public List<Gallery> galleries;

    public static void add(String username, String password, String email, boolean verified) {
        Artist artist = new Artist();
        artist.name = username;
        artist.hashed_password = BcryptUtil.bcryptHash(password);
        artist.role = "artist";
        artist.email = email;
        artist.verified = verified;
        artist.persist();
    }

    /**
     * Verifies an artist, does not do the actual verification
     * @param id The artist to verify
     * @return True if the artist was verified, false if the artist was not found
     */
    public static Boolean addVerifiedToArtist(Long id) {
        Artist artist = findById(id);
        if (artist != null) {
            artist.verified = true;
            artist.persist();
            return true;
        }
        return false;
    }

    public static List<Artist> findAllArtists() {
        return listAll();
    }

    public static List<Artist> findAllVerifiedArtists() {
        return list("verified", true);
    }


}