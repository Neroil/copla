package art.dtos;

import java.util.List;
import java.util.ArrayList;
import art.entities.CommissionCard;
import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public class CommissionCardDto {
    public Long id;
    public String title;
    public String description;
    public List<CommissionCardElementDto> elements;

    public CommissionCardDto() {
    }

    public CommissionCardDto(CommissionCard entity) {
        this.id = entity.id;
        this.title = entity.title;
        this.description = entity.description;

        this.elements = new ArrayList<>();
        if (entity.elements != null) {
            entity.elements.forEach(element -> this.elements.add(new CommissionCardElementDto(element)));
        }
    }

    public CommissionCard toEntity() {
        CommissionCard card = new CommissionCard();
        card.id = this.id;
        card.title = this.title != null ? this.title : "";
        card.description = this.description != null ? this.description : "";
        card.elements = new ArrayList<>();
        return card;
    }
}