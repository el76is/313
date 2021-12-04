package kata.academy.rest.dao;

import kata.academy.rest.entities.Role;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Set;
import java.util.stream.Collectors;

@Repository
public class RoleDaoImpl implements RoleDao {

    @PersistenceContext
    EntityManager entityManager;

    @Override
    public Set<Role> getAllRoles() {
        return entityManager.createQuery("SELECT u FROM Role u", Role.class)
                .getResultStream().collect(Collectors.toSet());
    }

    @Override
    public Role getByName(String roleName) {
        return entityManager.createQuery("SELECT u FROM Role u WHERE u.role = :role", Role.class)
                .setParameter("role", roleName)
                .getSingleResult();
    }

    @Override
    public void create(Role role) {
        entityManager.persist(role);
    }
}
