package art.dtos;

import art.entities.SocialProfile;
import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public class SocialProfileDto {
    public Long id;
    public String platform;
    public String username;
    public String profileUrl;
    public boolean isVerified;

    public SocialProfileDto() {
    }

    public SocialProfileDto(SocialProfile socialProfile) {
        this.id = socialProfile.id;
        this.platform = socialProfile.platform;
        this.username = socialProfile.username;
        this.profileUrl = socialProfile.profileUrl;
        this.isVerified = socialProfile.isVerified;
    }
}