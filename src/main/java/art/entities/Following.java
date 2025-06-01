package art.entities;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "following")
public class Following extends PanacheEntity {
    
    @ManyToOne
    @JoinColumn(name = "follower_id")
    public User follower;
    
    @ManyToOne
    @JoinColumn(name = "followed_id")
    public User followed;
    
    public String blueskyHandle;
    public String blueskyDid;
    public String blueskyDisplayName;
    public LocalDateTime followedAt;
    public LocalDateTime syncedAt;
    
    public static Following findByFollowerAndHandle(User follower, String blueskyHandle) {
        return find("follower = ?1 and blueskyHandle = ?2", follower, blueskyHandle).firstResult();
    }
    
    public static List<Following> findByFollower(User follower) {
        return find("follower", follower).list();
    }
    
    public static List<Following> findOpenForCommissions(User follower) {
        return find("follower = ?1 and followed.role = 'artist' and followed.isOpenForCommissions = true", follower).list();
    }
    
    public static void createOrUpdate(User follower, String blueskyHandle, String blueskyDid, String displayName) {
        Following existing = findByFollowerAndHandle(follower, blueskyHandle);
        if (existing == null) {
            Following following = new Following();
            following.follower = follower;
            following.blueskyHandle = blueskyHandle;
            following.blueskyDid = blueskyDid;
            following.blueskyDisplayName = displayName;
            following.followedAt = LocalDateTime.now();
            following.syncedAt = LocalDateTime.now();
            
            // Try to link with existing Copla user
            User coplaUser = findCoplaUserByBlueskyHandle(blueskyHandle);
            if (coplaUser != null) {
                following.followed = coplaUser;
            }
            
            following.persist();
        } else {
            existing.blueskyDid = blueskyDid;
            existing.blueskyDisplayName = displayName;
            existing.syncedAt = LocalDateTime.now();
            
            // Re-check linking in case new users registered
            if (existing.followed == null) {
                User coplaUser = findCoplaUserByBlueskyHandle(blueskyHandle);
                if (coplaUser != null) {
                    existing.followed = coplaUser;
                }
            }
            
            existing.persist();
        }
    }
    
    private static User findCoplaUserByBlueskyHandle(String blueskyHandle) {
        // Look for users with matching Bluesky profiles
        return User.find("SELECT u FROM User u JOIN u.socialProfiles sp WHERE sp.platform = 'bluesky' AND sp.username = ?1", blueskyHandle).firstResult();
    }
}
