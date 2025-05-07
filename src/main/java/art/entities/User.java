package art.entities;

import io.quarkus.elytron.security.common.BcryptUtil;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import io.quarkus.security.jpa.Password;
import io.quarkus.security.jpa.Roles;
import io.quarkus.security.jpa.Username;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import io.quarkus.security.jpa.UserDefinition;

import java.util.List;

@Entity
@Table(name = "users")
@UserDefinition
public class User extends PanacheEntity {

    @Username //Username is the ID
    public String name;

    @Password //Password is hashed with Bcrypt by default
    public String hashed_password;

    @Roles
    public String role;

    public String email;

    public static void add(String username, String password) {
        add(username, password, null);
    }

    public static void add(String username, String password, String email) {
        User user = new User();
        user.name = username;
        user.hashed_password = password;
        user.role = "user";
        user.email = email;
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
