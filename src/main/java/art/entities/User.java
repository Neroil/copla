package art.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class User {

    public String name;
    public String hashed_password;
    public String email;
    @Id
    @GeneratedValue
    private Long id;


    public User() {
    }

    public User(String name, String email, String hashed_password) {
        this.name = name;
        this.email = email;
        this.hashed_password = hashed_password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getHashed_password() {
        return hashed_password;
    }

    public void setHashed_password(String password) {
        this.hashed_password = password;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
