package art.dtos;
import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public class UserRegistrationDto {
    public String name;
    public String password;
    public String email;
    public boolean isArtist;
}