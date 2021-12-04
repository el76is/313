package kata.academy.rest.dao;

import kata.academy.rest.entities.User;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Repository
public class UserDaoImpl implements UserDao {

    @PersistenceContext
    EntityManager entityManager;

    @Override
    public List<User> getAllUsers() {
        return entityManager.createQuery("SELECT u FROM User u ORDER BY u.userId", User.class).getResultList();
    }

    @Override
    public User getUserById (Long id) { return entityManager.find(User.class,id); }

    @Override
    public Long getIdByUsername(String username){
        try {
            return entityManager.createQuery("SELECT u FROM User u WHERE u.username = :username", User.class)
                    .setParameter("username", username)
                    .getSingleResult()
                    .getUserId();
        } catch (Throwable err) {
            return -1L;
        }
    }

    @Override
    public User getUserByUsername(String username) {
        return entityManager.find(User.class, getIdByUsername(username));
    }

    @Override
    public User getUserByEmail(String email) {
        return entityManager.createQuery("SELECT u FROM User u WHERE u.email = :email", User.class)
                .setParameter("email", email)
                .getSingleResult();
    }

    @Transactional
    public void create(User user) {
        entityManager.persist(user);
    }

    @Transactional
    public void update(User user) {
        entityManager.merge(user);
    }

    @Transactional
    public void delete(Long id) {
        entityManager.createQuery("DELETE FROM User u WHERE u.userId = :id")
                .setParameter("id", id)
                .executeUpdate();
    }
}
