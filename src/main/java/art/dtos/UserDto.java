package art.dtos;

import java.time.LocalDateTime;

public class UserDto {
    public Long id;
    public String name;
    public String email;
    public LocalDateTime timeCreated;
    public String profilePicPath;
    public String bio;
    public String role;
    public SocialProfileDto[] socialProfiles;
}

