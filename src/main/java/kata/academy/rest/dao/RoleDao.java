package kata.academy.rest.dao;

import kata.academy.rest.entities.Role;

import java.util.Set;

public interface RoleDao {

    Set<Role> getAllRoles();

    Role getByName(String roleName);

    void create(Role role);
}

