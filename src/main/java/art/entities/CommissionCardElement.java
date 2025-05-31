package art.entities;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.util.List;

@Entity
public class CommissionCardElement extends PanacheEntity {

    public String title;
    public String description;

    @ElementCollection
    @CollectionTable(name = "commission_card_element_images", joinColumns = @JoinColumn(name = "element_id"))
    @Column(name = "image_url")
    public List<String> exampleImageUrls; // Optional

    public Double price; // Optional

    @ManyToOne
    @JoinColumn(name = "commission_card_id")
    public CommissionCard commissionCard;

    public static void add(String title, String description, List<String> exampleImageUrls, Double price,
            CommissionCard commissionCard) {
        CommissionCardElement element = new CommissionCardElement();
        element.title = title;
        element.description = description;
        element.exampleImageUrls = exampleImageUrls;
        element.price = price;
        element.commissionCard = commissionCard;
        commissionCard.addElement(element);
        element.persist();
    }
}