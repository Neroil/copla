package art;

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
            User.add("alice", "alice", "user", "alice@gmail.com"); // Add user 'alice' with password 'alice' and role 'user'
        }
    }
}