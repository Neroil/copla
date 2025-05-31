package art.entities;

import io.quarkus.elytron.security.common.BcryptUtil;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import io.quarkus.security.jpa.*;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@UserDefinition
public class User extends PanacheEntity {
    @Username
    public String name;

    @Password
    public String hashed_password;

    @Roles
    public String role;

    public String email;

    public LocalDateTime timeCreated;

    public String profilePicPath;

    public String bio;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<SocialProfile> socialProfiles = new ArrayList<>();

    public static void add(String username, String password) {
        add(username, password, null);
    }

    public static void add(String username, String password, String email) {
        User user = new User();
        user.name = username;
        user.hashed_password = BcryptUtil.bcryptHash(password);
        user.role = "user";
        user.email = email;
        user.timeCreated = LocalDateTime.now();
        user.persist();
    }

    public static User findByUsername(String username) {
        return find("name", username).firstResult();
    }

    public static User findByEmail(String email) {
        return find("email", email).firstResult();
    }

    public static Boolean existsName(String username) {
        return findByUsername(username) != null;
    }

    public static Boolean existsEmail(String email) {
        return findByEmail(email) != null;
    }

    public static List<User> findAllUsers() {
        return listAll();
    }

}
