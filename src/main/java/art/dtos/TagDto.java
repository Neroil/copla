package art.dtos;

import art.entities.Tag;
import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public class TagDto {
    public Long id;
    public String name;
    public String description;
    public String category;
    public boolean isActive;

    public TagDto() {
    }

    public TagDto(Tag tag) {
        this.id = tag.id;
        this.name = tag.name;
        this.description = tag.description;
        this.category = tag.category;
        this.isActive = tag.isActive;
    }
}