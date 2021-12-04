package kata.academy.rest.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import kata.academy.rest.entities.User;
import kata.academy.rest.service.UserService;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;

@Controller
@RequestMapping("/")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/api/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    @GetMapping("/api/user")
    public ResponseEntity<?> getUserByUsername(Principal principal) {
        User user = userService.getUserByUsername(principal.getName());
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/api/user/{id}")
    public ResponseEntity<?> getUserById(@PathVariable("id") long id) {
        User user = userService.getUserById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PostMapping("/api/user")
    public ResponseEntity<?> create(@Valid @RequestBody User user, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        userService.create(user);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/api/user/{id}")
    public ResponseEntity<?> update(@PathVariable("id") long id, @Valid @RequestBody User user,
                                    BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        userService.update(user);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/api/user/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") long id) {
        userService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
