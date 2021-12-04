package kata.academy.rest.dao;

import kata.academy.rest.entities.User;

import java.util.List;

public interface UserDao {

    List<User> getAllUsers();

    User getUserById(Long id);

    Long getIdByUsername(String username);

    User getUserByUsername(String username);

    User getUserByEmail(String email);

    void create(User user);

    void update(User user);

    void delete(Long id);
}
