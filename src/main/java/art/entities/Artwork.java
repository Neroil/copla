package art.entities;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "artworks")
public class Artwork extends PanacheEntity {

    public String title;
    public String description;
    public LocalDateTime timeCreated;
    public String imageUrl;
    public Double price; //Optional

    @ManyToOne
    public Artist artist;

    public static void add(String title, String description, LocalDateTime timeCreated, String imageUrl, Double price, Artist artist) {
        Artwork artwork = new Artwork();
        artwork.title = title;
        artwork.description = description;
        artwork.timeCreated = timeCreated;
        artwork.imageUrl = imageUrl;
        artwork.price = price;
        artwork.artist = artist;
        artwork.persist();
    }

    public static void delete(Long id) {
        Artwork artwork = findById(id);
        if (artwork != null) {
            artwork.delete();
        }
    }

    public static void edit(Long id, String title, String description, LocalDateTime timeCreated, String imageUrl, Double price, Artist artist) {
        Artwork artwork = findById(id);
        if (artwork != null) {
            artwork.title = title;
            artwork.description = description;
            artwork.timeCreated = timeCreated;
            artwork.imageUrl = imageUrl;
            artwork.price = price;
            artwork.artist = artist;
            artwork.persist();
        }
    }

    public static List<Artwork> findAllArtworks() {
        return listAll();
    }

    public static List<Artwork> findAllArtworksByArtistId(Long artistId) {
        return list("artist.id", artistId);
    }

}
