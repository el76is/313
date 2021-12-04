package kata.academy.rest.config;

import kata.academy.rest.entities.Role;
import kata.academy.rest.entities.User;
import kata.academy.rest.service.RoleService;
import kata.academy.rest.service.UserService;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Set;

@Component
public class LoaderConfiguration {

    private final UserService userService;

    private final RoleService roleService;

    public LoaderConfiguration(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @PostConstruct
    public void fillDb() {
        Role roleAdm = new Role();
        roleAdm.setRole("ROLE_ADMIN");
        roleService.create(roleAdm);
        Role roleUsr = new Role();
        roleUsr.setRole("ROLE_USER");
        roleService.create(roleUsr);

        User user1 = new User();
        user1.setUsername("user1");
        user1.setPassword("user1");
        user1.setRoles(Set.of(roleAdm));
        user1.setFirstName("FirstName1");
        user1.setLastName("LastName1");
        user1.setAge((byte) 15);
        user1.setEmail("user1@somewhere.net");
        userService.create(user1);

        User user2 = new User();
        user2.setUsername("user2");
        user2.setPassword("user2");
        user2.setRoles(Set.of(roleUsr));
        user2.setFirstName("FirstName2");
        user2.setLastName("LastName2");
        user2.setAge((byte) 25);
        user2.setEmail("user2@somewhere.net");
        userService.create(user2);

        User user3 = new User();
        user3.setUsername("user3");
        user3.setPassword("user3");
        user3.setRoles(Set.of(roleAdm, roleUsr));
        user3.setFirstName("FirstName3");
        user3.setLastName("LastName3");
        user3.setAge((byte) 35);
        user3.setEmail("user3@somewhere.net");
        userService.create(user3);
    }
}
