package kata.academy.rest.service;

import kata.academy.rest.dao.RoleDao;
import kata.academy.rest.entities.Role;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
public class RoleServiceImpl implements RoleService{

    private final RoleDao roleDao;

    public RoleServiceImpl(RoleDao roleDao) {
        this.roleDao = roleDao;
    }

    @Override
    public Set<Role> getAllRoles() {
        return roleDao.getAllRoles();
    }

    @Override
    public Role getByName(String roleName) {
        return roleDao.getByName(roleName);
    }

    @Override
    @Transactional
    public void create(Role role) {
        roleDao.create(role);
    }
}
