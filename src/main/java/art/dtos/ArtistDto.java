package art.dtos;

import art.entities.Artist;
import art.entities.Tag; // Assuming Tag entity is available

public class ArtistDto extends UserDto {
    public boolean verified;
    public boolean isOpenForCommissions;
    public CommissionCardDto commissionCard;
    public double lowestPrice;
    public String[] relatedTags;

    // Default constructor
    public ArtistDto() {
        super();
        // Initialize artist-specific fields to sensible defaults if necessary
        this.isOpenForCommissions = false;
        this.verified = false;
        this.lowestPrice = 0.0;
        this.commissionCard = null; // Or new CommissionCardDto() if an empty card is preferred over null
        this.relatedTags = new String[0];
    }
    
    // Constructor from Artist entity
    public ArtistDto(Artist artist) {
        super(artist); // Initialize common user fields from UserDto's constructor
        
        this.verified = artist.verified;
        this.isOpenForCommissions = artist.isOpenForCommissions;
        this.commissionCard = artist.commissionCard != null ? new CommissionCardDto(artist.commissionCard) : null;
        this.lowestPrice = artist.getLowestPrice(); // Assumes getLowestPrice() is a method on the Artist entity
        
        if (artist.relatedTags != null) {
            this.relatedTags = artist.relatedTags.stream()
                .map(tag -> tag.name) // Assuming Tag entity has a public 'name' field or a getName() method
                .toArray(String[]::new);
        } else {
            this.relatedTags = new String[0];
        }
    }
}