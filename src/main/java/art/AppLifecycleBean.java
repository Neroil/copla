package art;

import art.entities.Artist;
import art.entities.CommissionCard;
import art.entities.CommissionCardElement;
import art.entities.SocialProfile;
import art.entities.Tag;
import art.entities.User;
import io.quarkus.runtime.StartupEvent;
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
        // Initialize default tags on application startup
        Tag.createDefaultTags();

        
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

            user.persist();
        }

        if (!Artist.existsName("neroil")) {
            Artist.add("neroil", "neroil", "neroil@hotmail.com", true);

            CommissionCard card = new CommissionCard();
            card.title = "My Commission Card";
            card.description = "This is my commission card.";

            CommissionCardElement.add("Portrait", "A detailed portrait of a character.", null, 100.0, card);
            CommissionCardElement.add("Landscape", "A beautiful landscape painting.", null, 150.0, card);

            card.persist();


            Artist.setCommissionCard("neroil", card);
            

            System.out.println("Commission card set for artist 'neroil'.");

        }
    }
}