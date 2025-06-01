package art;

import art.entities.Artist;
import art.entities.CommissionCard;
import art.entities.CommissionCardElement;
import art.entities.Following;
import art.entities.SocialProfile;
import art.entities.Tag;
import art.entities.User;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;

import java.util.List;

/**
 * Lifecycle bean to initialize elements on application startup.
 */
@Singleton
public class AppLifecycleBean {

    @Transactional
    void onStart(@Observes StartupEvent ev) {
        // Initialize default tags on application startup
        Tag.createDefaultTags();

        // Create regular users
        if (!User.existsName("alice")) {
            User.add("alice", "alice", "alice@gmail.com");
            var user = User.findByUsername("alice");
            user.profilePicPath = "/api/images/view/alice_profile.jpg";
            user.bio = "Art enthusiast and collector. Love supporting independent artists!";

            var verifiedProfile = new SocialProfile();
            verifiedProfile.user = user;
            verifiedProfile.platform = "bluesky";
            verifiedProfile.username = "alice_bluesky";
            verifiedProfile.profileUrl = "https://bsky.app/profile/alice.bsky.social";
            verifiedProfile.isVerified = true;
            user.socialProfiles.add(verifiedProfile);

            user.persist();
        }

        if (!User.existsName("bob")) {
            User.add("bob", "bob", "bob@example.com");
            var user = User.findByUsername("bob");
            user.profilePicPath = "/api/images/view/bob_profile.jpg";
            user.bio = "Gaming fan and digital art collector.";
            user.persist();
        }

        if (!User.existsName("charlie")) {
            User.add("charlie", "charlie", "charlie@test.com");
            var user = User.findByUsername("charlie");
            user.profilePicPath = "/api/images/view/charlie_profile.jpg";
            user.bio = "Traditional art lover, especially watercolors and sketches.";
            user.persist();
        }

        // Create diverse artists
        if (!Artist.existsName("neroil")) {
            Artist.add("neroil", "neroil", "neroil@hotmail.com", false);
            var artist = (Artist) Artist.findByUsername("neroil");
            artist.profilePicPath = "/api/images/view/neroil_profile.jpg";
            artist.bio = "Digital illustrator specializing in fantasy and character design.";

            // Add tags for neroil
            var digitalTag = Tag.findByName("Digital");
            var fantasyTag = Tag.findByName("Fantasy");
            if (digitalTag != null)
                artist.addTag(digitalTag);
            if (fantasyTag != null)
                artist.addTag(fantasyTag);

            CommissionCard card = new CommissionCard();
            card.title = "Fantasy Character Commissions";
            card.description = "High-quality digital character illustrations for your fantasy projects.";

            CommissionCardElement.add("Portrait", "A detailed portrait of a character.",
                    List.of("/api/images/view/neroil_portrait_sample.jpg"), 100.0, card);
            CommissionCardElement.add("Full Body", "Complete character illustration.",
                    List.of("/api/images/view/neroil_fullbody_sample.jpg"), 200.0, card);
            CommissionCardElement.add("Character Sheet", "Multiple poses and expressions.",
                    List.of("/api/images/view/neroil_sheet_sample.jpg"), 350.0, card);

            card.persist();
            Artist.setCommissionCard("neroil", card);
        }

        if (!Artist.existsName("sakura_art")) {
            Artist.add("sakura_art", "sakura123", "sakura@artmail.com", true);
            var artist = (Artist) Artist.findByUsername("sakura_art");
            artist.profilePicPath = "/api/images/view/sakura_profile.jpg";
            artist.bio = "Traditional Japanese-inspired artist. Watercolors and ink specialization.";
            artist.verified = true;

            // Add Bluesky profile for verification
            var blueskyProfile = new SocialProfile();
            blueskyProfile.user = artist;
            blueskyProfile.platform = "bluesky";
            blueskyProfile.username = "sakura.art";
            blueskyProfile.profileUrl = "https://bsky.app/profile/sakura.art";
            blueskyProfile.isVerified = true;
            blueskyProfile.displayName = "Sakura Art Studio";
            artist.socialProfiles.add(blueskyProfile);

            // Add tags
            var traditionalTag = Tag.findByName("Traditional");
            var watercolorTag = Tag.findByName("Watercolor");
            if (traditionalTag != null)
                artist.addTag(traditionalTag);
            if (watercolorTag != null)
                artist.addTag(watercolorTag);

            CommissionCard card = new CommissionCard();
            card.title = "Traditional Watercolor Art";
            card.description = "Handpainted watercolor pieces with Japanese aesthetic influence.";

            CommissionCardElement.add("Small Painting", "A4 size watercolor painting.",
                    List.of("/api/images/view/sakura_small_sample.jpg"), 80.0, card);
            CommissionCardElement.add("Medium Painting", "A3 size detailed watercolor.",
                    List.of("/api/images/view/sakura_medium_sample.jpg"), 150.0, card);
            CommissionCardElement.add("Large Commission", "A2 size masterpiece.",
                    List.of("/api/images/view/sakura_large_sample.jpg"), 300.0, card);

            card.persist();
            Artist.setCommissionCard("sakura_art", card);
            artist.persist();
        }

        if (!Artist.existsName("pixel_master")) {
            Artist.add("pixel_master", "pixelpass", "pixel@retrogames.com", true);
            var artist = (Artist) Artist.findByUsername("pixel_master");
            artist.profilePicPath = "/api/images/view/pixel_profile.jpg";
            artist.bio = "Retro game-inspired pixel artist. Creating nostalgic 8-bit and 16-bit style artwork.";

            // Add tags
            var pixelTag = Tag.findByName("Pixel Art");
            var gameTag = Tag.findByName("Game Art");
            if (pixelTag != null)
                artist.addTag(pixelTag);
            if (gameTag != null)
                artist.addTag(gameTag);

            CommissionCard card = new CommissionCard();
            card.title = "Retro Pixel Art Commissions";
            card.description = "Custom pixel art in classic video game styles.";

            CommissionCardElement.add("Character Sprite", "16x16 to 32x32 pixel character.",
                    List.of("/api/images/view/pixel_sprite_sample.png"), 25.0, card);
            CommissionCardElement.add("Background Scene", "Detailed pixel art background.",
                    List.of("/api/images/view/pixel_background_sample.png"), 75.0, card);
            CommissionCardElement.add("Animation Set", "4-8 frame character animation.",
                    List.of("/api/images/view/pixel_animation_sample.gif"), 120.0, card);

            card.persist();
            Artist.setCommissionCard("pixel_master", card);
            artist.persist();
        }

        if (!Artist.existsName("abstract_dream")) {
            Artist.add("abstract_dream", "dreampass", "abstract@modernart.com", false);
            var artist = (Artist) Artist.findByUsername("abstract_dream");
            artist.profilePicPath = "/api/images/view/abstract_profile.jpg";
            artist.bio = "Contemporary abstract artist exploring emotions through color and form.";
            artist.verified = false; // Not verified, no commission card yet

            // Add tags
            var abstractTag = Tag.findByName("Abstract");
            var contemporaryTag = Tag.findByName("Contemporary");
            if (abstractTag != null)
                artist.addTag(abstractTag);
            if (contemporaryTag != null)
                artist.addTag(contemporaryTag);

            artist.persist();
        }

        if (!Artist.existsName("sketch_daily")) {
            Artist.add("sketch_daily", "sketchpass", "daily@sketches.com", true);
            var artist = (Artist) Artist.findByUsername("sketch_daily");
            artist.profilePicPath = "/api/images/view/sketch_profile.jpg";
            artist.bio = "Daily sketch artist. Quick studies, character concepts, and gesture drawings.";
            artist.verified = true;

            // Add social media
            var instagramProfile = new SocialProfile();
            instagramProfile.user = artist;
            instagramProfile.platform = "instagram";
            instagramProfile.username = "sketch_daily_art";
            instagramProfile.profileUrl = "https://instagram.com/sketch_daily_art";
            instagramProfile.isVerified = false;
            artist.socialProfiles.add(instagramProfile);

            var blueskyProfile = new SocialProfile();
            blueskyProfile.user = artist;
            blueskyProfile.platform = "bluesky";
            blueskyProfile.username = "sketchdaily.bsky.social";
            blueskyProfile.profileUrl = "https://bsky.app/profile/sketchdaily.bsky.social";
            blueskyProfile.isVerified = true;
            blueskyProfile.displayName = "Daily Sketch Artist";
            artist.socialProfiles.add(blueskyProfile);

            // Add tags
            var sketchTag = Tag.findByName("Sketch");
            var conceptTag = Tag.findByName("Concept Art");
            if (sketchTag != null)
                artist.addTag(sketchTag);
            if (conceptTag != null)
                artist.addTag(conceptTag);

            CommissionCard card = new CommissionCard();
            card.title = "Quick Sketch Commissions";
            card.description = "Fast, expressive sketches perfect for concept work and character studies.";

            CommissionCardElement.add("Quick Sketch", "15-minute character sketch.",
                    List.of("/api/images/view/sketch_quick_sample.jpg"), 15.0, card);
            CommissionCardElement.add("Detailed Sketch", "1-hour detailed study.",
                    List.of("/api/images/view/sketch_detailed_sample.jpg"), 45.0, card);
            CommissionCardElement.add("Sketch Page", "Multiple poses/expressions.",
                    List.of("/api/images/view/sketch_page_sample.jpg"), 80.0, card);

            card.persist();
            Artist.setCommissionCard("sketch_daily", card);
            artist.persist();
        }

        if (!Artist.existsName("3d_sculptor")) {
            Artist.add("3d_sculptor", "sculptpass", "sculptor@3dart.com", false);
            var artist = (Artist) Artist.findByUsername("3d_sculptor");
            artist.profilePicPath = "/api/images/view/sculptor_profile.jpg";
            artist.bio = "3D digital sculptor and character modeler. Creating detailed models for games and animation.";

            // Add tags
            var threeDTag = Tag.findByName("3D");
            var sculptureTag = Tag.findByName("Sculpture");
            if (threeDTag != null)
                artist.addTag(threeDTag);
            if (sculptureTag != null)
                artist.addTag(sculptureTag);

            artist.persist();
        }

                // Add copla1 and copla2 as artists with Bluesky accounts
        if (!Artist.existsName("copla1")) {
            Artist.add("copla1", "copla1", "copla1@example.com", true);
            var artist = (Artist) Artist.findByUsername("copla1");
            artist.profilePicPath = "/api/images/view/copla1_profile.jpg";
            artist.bio = "Test artist with verified Bluesky account for development purposes.";
            artist.verified = true;

            // Add verified Bluesky profile
            var blueskyProfile = new SocialProfile();
            blueskyProfile.user = artist;
            blueskyProfile.platform = "bluesky";
            blueskyProfile.username = "copla1.bsky.social";
            blueskyProfile.profileUrl = "https://bsky.app/profile/copla1.bsky.social";
            blueskyProfile.isVerified = true;
            blueskyProfile.displayName = "Copla Artist 1";
            artist.socialProfiles.add(blueskyProfile);

            artist.isOpenForCommissions = true;

            // Add some tags
            var digitalTag = Tag.findByName("Digital");
            if (digitalTag != null)
                artist.addTag(digitalTag);

            artist.persist();
        }

        if (!Artist.existsName("copla2")) {
            Artist.add("copla2", "copla2", "copla2@example.com", true);
            var artist = (Artist) Artist.findByUsername("copla2");
            artist.profilePicPath = "/api/images/view/copla2_profile.jpg";
            artist.bio = "Another test artist with verified Bluesky account for development purposes.";
            artist.verified = true;

            // Add verified Bluesky profile
            var blueskyProfile = new SocialProfile();
            blueskyProfile.user = artist;
            blueskyProfile.platform = "bluesky";
            blueskyProfile.username = "copla2.bsky.social";
            blueskyProfile.profileUrl = "https://bsky.app/profile/copla2.bsky.social";
            blueskyProfile.isVerified = true;
            blueskyProfile.displayName = "Copla Artist 2";
            artist.socialProfiles.add(blueskyProfile);

            // Add some tags
            var illustrationTag = Tag.findByName("Illustration");
            if (illustrationTag != null)
                artist.addTag(illustrationTag);

            artist.persist();
        }

        // Create sample following relationships for alice
        var alice = User.findByUsername("alice");
        var copla1 = User.findByUsername("copla1");
        var copla2 = User.findByUsername("copla2");
        var sakuraArt = User.findByUsername("sakura_art");
        
        if (alice != null && copla1 != null) {
            Following.createOrUpdate(alice, "copla1.bsky.social", "did:copla1", "Copla Artist 1");
        }
        if (alice != null && copla2 != null) {
            Following.createOrUpdate(alice, "copla2.bsky.social", "did:copla2", "Copla Artist 2");
        }
        if (alice != null && sakuraArt != null) {
            Following.createOrUpdate(alice, "sakura.art", "did:sakura", "Sakura Art Studio");
        }

        System.out.println(
                "Initialized sample data: 3 users and 8 artists with various specializations, tags, commission cards, and following relationships.");

    }
}