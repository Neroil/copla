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

@Entity
@Table(name = "users")
@UserDefinition
public class User extends PanacheEntity {

    @Username //Username is the ID
    public String name;

    @Password
    public String hashed_password;

    @Roles
    public String role;

    public String email;

    public static void add(String username, String password, String role) {
        add(username, password, role, null);
    }

    public static void add(String username, String password, String role, String email) {
        User user = new User();
        user.name = username;
        user.hashed_password = BcryptUtil.bcryptHash(password); // Automatically hash the password
        user.role = role;
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


}
