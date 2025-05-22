package art.entities;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "social_profiles")
public class SocialProfile extends PanacheEntity {

    @ManyToOne
    @JoinColumn(name = "user_id")
    public User user;

    @Column(nullable = false)
    public String platform;

    @Column(nullable = false)
    public String username;

    @Column(nullable = false)
    public String profileUrl;

    public boolean isVerified;

    public String did;
    public String displayName;
}