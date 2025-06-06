package art.dtos;

import java.time.LocalDateTime;
import art.entities.User;
import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public class UserDto {
    public Long id;
    public String name;
    public String email;
    public LocalDateTime timeCreated;
    public String profilePicPath;
    public String bio;
    public String role;
    public SocialProfileDto[] socialProfiles;

    public UserDto() {
    }

    public UserDto(User user) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.timeCreated = user.timeCreated;
        this.profilePicPath = user.profilePicPath;
        this.bio = user.bio;
        this.role = user.role;

        if (user.socialProfiles != null) {
            this.socialProfiles = user.socialProfiles.stream()
                    .map(SocialProfileDto::new)
                    .toArray(SocialProfileDto[]::new);
        } else {
            this.socialProfiles = new SocialProfileDto[0];
        }
    }
}