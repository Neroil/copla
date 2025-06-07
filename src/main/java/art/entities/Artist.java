package art.entities;

import io.quarkus.elytron.security.common.BcryptUtil;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Artist extends User {
    public boolean verified;
    public boolean isOpenForCommissions = false; // If the artist is open for commissions or not

    @ManyToMany
    public List<Tag> relatedTags; // Tags related to the artist, e.g., styles, mediums, genres

    @OneToMany
    public List<Gallery> galleries;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    public CommissionCard commissionCard; // An artist should only have one commission card that they can update
                                        

    public static void add(String username, String password, String email, boolean verified) {
        Artist artist = new Artist();
        artist.name = username;
        artist.hashed_password = BcryptUtil.bcryptHash(password);
        artist.role = "artist";
        artist.email = email;
        artist.verified = verified;
        artist.timeCreated = LocalDateTime.now();
        artist.persist();
    }

    /**
     * Verifies an artist, does not do the actual verification
     * 
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

    public static CommissionCard getCommissionCard(String username) {
        Artist artist = (Artist) findByUsername(username); // Cast to artist which is ok
        if (artist != null) {
            return artist.commissionCard;
        }
        return null;
    }

    public static void setCommissionCard(String username, CommissionCard commissionCard) {
        Artist artist = (Artist) findByUsername(username); // Cast to artist which is ok
        if (artist != null) {
            artist.commissionCard = commissionCard;
            artist.persist();
        }
    }

    public static double getLowestPrice(String username) {
        Artist artist = (Artist) findByUsername(username); // Cast to artist which is ok
        if (artist != null && artist.commissionCard != null && !artist.commissionCard.elements.isEmpty()) {
            return artist.commissionCard.elements.stream()
                    .mapToDouble(element -> element.price)
                    .min()
                    .orElse(0.0);
        }
        return 0.0;
    }

    public static void addTagToArtist(String username, Tag tag) {
        Artist artist = (Artist) findByUsername(username); // Cast to artist which is ok
        if (artist != null) {
            artist.addTag(tag);
        }
    }

    public void addTag(Tag tag) {
        if (this.relatedTags == null) {
            this.relatedTags = new ArrayList<>();
        }
        if (!this.relatedTags.contains(tag)) {
            this.relatedTags.add(tag);
        }
        this.persist();
    }

    public void removeTag(Tag tag) {
        if (this.relatedTags != null) {
            this.relatedTags.remove(tag);
            this.persist();
        }
    }

    public void setOpenForCommissions(boolean isOpen) {
        this.isOpenForCommissions = isOpen;
        this.persist();
    }

    public double getLowestPrice() {
        return getLowestPrice(this.name);
    }

}