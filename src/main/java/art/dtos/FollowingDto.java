package art.dtos;

import art.entities.Following;
import io.quarkus.runtime.annotations.RegisterForReflection;
import art.entities.Artist;
import java.time.LocalDateTime;

@RegisterForReflection
public class FollowingDto {
    public Long id;
    public String blueskyHandle;
    public String blueskyDisplayName;
    public UserDto coplaUser;
    public Boolean isLinked;
    public Boolean isOpenForCommissions;
    public LocalDateTime followedAt;
    public LocalDateTime syncedAt;
    
    public FollowingDto(Following following) {
        this.id = following.id;
        this.blueskyHandle = following.blueskyHandle;
        this.blueskyDisplayName = following.blueskyDisplayName;
        this.isLinked = following.followed != null;
        this.followedAt = following.followedAt;
        this.syncedAt = following.syncedAt;
        
        if (following.followed != null) {
            if ("artist".equals(following.followed.role)) {
                this.coplaUser = new ArtistDto((Artist) following.followed);
                this.isOpenForCommissions = ((Artist) following.followed).isOpenForCommissions;
            } else {
                this.coplaUser = new UserDto(following.followed);
                this.isOpenForCommissions = false;
            }
        } else {
            this.isOpenForCommissions = false;
        }
    }
}
