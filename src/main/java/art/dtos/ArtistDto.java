package art.dtos;

import art.entities.Artist;

public class ArtistDto extends UserDto {
    public boolean verified;
    public boolean isOpenForCommissions;
    public CommissionCardDto commissionCard;
    public double lowestPrice;
    public String[] relatedTags;

    public ArtistDto() {
        super();
        this.isOpenForCommissions = false;
        this.verified = false;
        this.lowestPrice = 0.0;
        this.commissionCard = null;
        this.relatedTags = new String[0];
    }

    public ArtistDto(Artist artist) {
        super(artist);
        this.verified = artist.verified;
        this.isOpenForCommissions = artist.isOpenForCommissions;
        this.commissionCard = artist.commissionCard != null ? new CommissionCardDto(artist.commissionCard) : null;
        this.lowestPrice = artist.getLowestPrice();
        if (artist.relatedTags != null) {
            this.relatedTags = artist.relatedTags.stream()
                    .map(tag -> tag.name)
                    .toArray(String[]::new);
        } else {
            this.relatedTags = new String[0];
        }
    }
}