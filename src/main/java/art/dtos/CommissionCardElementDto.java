package art.dtos;

import java.util.List;
import art.entities.CommissionCardElement;

public class CommissionCardElementDto {
    public Long id;
    public String title;
    public String description;
    public List<String> exampleImageUrls;
    public Double price;
    
    public CommissionCardElementDto() {
        // Default constructor for JSON serialization
    }
    
    public CommissionCardElementDto(CommissionCardElement entity) {
        this.id = entity.id;
        this.title = entity.title;
        this.description = entity.description;
        this.exampleImageUrls = entity.exampleImageUrls;
        this.price = entity.price;
    }
    
    public CommissionCardElement toEntity() {
        CommissionCardElement element = new CommissionCardElement();
        element.id = this.id;
        element.title = this.title;
        element.description = this.description;
        element.exampleImageUrls = this.exampleImageUrls;
        element.price = this.price;
        return element;
    }
}