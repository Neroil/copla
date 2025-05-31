package art.entities;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "galleries")
public class Gallery extends PanacheEntity {

    public String name;
    public String description;

    @JoinColumn(name = "artist_id")
    @ManyToOne
    public Artist artist;

    public static void add(String name, String description, Artist artist) {
        Gallery gallery = new Gallery();
        gallery.name = name;
        gallery.description = description;
        gallery.artist = artist;
        gallery.persist();
    }

    public static List<Gallery> findAllGalleries() {
        return listAll();
    }

    public static List<Gallery> findAllGalleriesByArtistId(Long artistId) {
        return list("artist.id", artistId);
    }
}
