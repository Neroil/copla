package art.entities;

import java.util.ArrayList;
import java.util.List;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

@Entity
public class CommissionCard extends PanacheEntity {

    public String title;
    public String description;

    @OneToMany(mappedBy = "commissionCard", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<CommissionCardElement> elements;

    @OneToOne(mappedBy = "commissionCard")
    public Artist artist;

    public void addElement(CommissionCardElement element) {
        if (elements == null) {
            elements = new ArrayList<>();
        }
        elements.add(element);
    }

    public void removeElement(CommissionCardElement element) {
        if (elements != null) {
            elements.remove(element);
        }
    }

    public static void add(String title, String description) {
        CommissionCard card = new CommissionCard();
        card.title = title;
        card.description = description;
        card.elements = new ArrayList<>();
        card.persist();
    }

    public static void update(Long id, String title, String description) {
        CommissionCard card = findById(id);
        if (card != null) {
            card.title = title;
            card.description = description;
            card.persist();
        }
    }

    public static void delete(Long id) {
        CommissionCard card = findById(id);
        if (card != null) {
            card.delete();
        }
    }

}
