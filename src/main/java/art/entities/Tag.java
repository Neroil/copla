package art.entities;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import java.util.List;

@Entity
public class Tag extends PanacheEntity {

    @Column(unique = true, nullable = false)
    public String name;

    @Column
    public String description;

    @Column
    public String category;

    @Column(name = "is_active")
    public boolean isActive = true; // Allow tags to be disabled without deletion

    // Static methods for querying
    public static List<Tag> findAllActiveTags() {
        return list("isActive", true);
    }

    public static List<Tag> findByCategory(String category) {
        return list("category = ?1 and isActive = true", category);
    }

    public static Tag findByName(String name) {
        return find("name = ?1 and isActive = true", name).firstResult();
    }

    public static List<String> getAllTagNames() {
        return findAllActiveTags().stream()
                .map(tag -> tag.name)
                .toList();
    }

    public static void createDefaultTags() {
        // Check if tags already exist
        if (count() > 0) {
            return;
        }

        // Style tags
        createTag("Portrait", "Portrait artwork", "style");
        createTag("Character Design", "Character design and concepts", "style");
        createTag("Illustration", "General illustration work", "style");
        createTag("Fantasy", "Fantasy themed artwork", "genre");
        createTag("Animation", "Animation and motion graphics", "medium");

        // Medium tags
        createTag("Digital", "Digital artwork", "medium");
        createTag("Traditional", "Traditional media artwork", "medium");
        createTag("3D", "3D modeling and rendering", "medium");
        createTag("Pixel Art", "Pixel art style", "medium");

        // Content tags
        createTag("NSFW", "Not safe for work content", "content");
        createTag("SFW", "Safe for work content", "content");
        createTag("Gore", "Gore and violence content", "content");

        // Genre tags
        createTag("Sci-Fi", "Science fiction themed", "genre");
        createTag("Horror", "Horror themed artwork", "genre");
        createTag("Romance", "Romance themed artwork", "genre");
        createTag("Abstract", "Abstract art", "genre");
    }

    private static void createTag(String name, String description, String category) {
        Tag tag = new Tag();
        tag.name = name;
        tag.description = description;
        tag.category = category;
        tag.isActive = true;
        tag.persist();
    }
}