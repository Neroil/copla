package art;

import art.entities.Artist;
import art.entities.SocialProfile;
import art.entities.User;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;

/**
 * Lifecycle bean to initialize elements on application startup.
 */
@Singleton
public class AppLifecycleBean {

    @Transactional
    void onStart(@Observes StartupEvent ev) {
        // Check if the user already exists to avoid duplicates on restart in dev mode
        if (!User.existsName("alice")) {
            User.add("alice", "alice", "alice@gmail.com");
            var user = User.findByUsername("alice");

            var verifiedProfile = new SocialProfile();
            verifiedProfile.user = user;
            verifiedProfile.platform = "bluesky";
            verifiedProfile.username = "alice_bluesky";
            verifiedProfile.profileUrl = "https://bsky.app/profile/alice.bsky.social";
            verifiedProfile.isVerified = true;
            user.socialProfiles.add(verifiedProfile);

            var unverifiedProfile = new SocialProfile();
            unverifiedProfile.user = user;
            unverifiedProfile.platform = "bluesky";
            unverifiedProfile.username = "alice_evil_bluesky";
            unverifiedProfile.profileUrl = "https://bsky.app/profile/alice.evil.bsky.social";
            unverifiedProfile.isVerified = false;
            user.socialProfiles.add(unverifiedProfile);

            user.persist();
        }

        if (!Artist.existsName("neroil")) {
            Artist.add("neroil", "neroil", "neroil@hotmail.com", true);

        }
    }
}