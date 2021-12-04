package kata.academy.rest.service;

import kata.academy.rest.entities.Role;

import java.util.Set;

public interface RoleService {

    Set<Role> getAllRoles();

    Role getByName(String roleName);

    void create(Role role);
}

