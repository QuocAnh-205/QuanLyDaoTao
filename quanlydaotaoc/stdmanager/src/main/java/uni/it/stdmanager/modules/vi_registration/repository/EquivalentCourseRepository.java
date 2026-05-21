package uni.it.stdmanager.modules.vi_registration.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.vi_registration.entity.EquivalentCourse;

import java.util.UUID;
import java.util.List;

@Repository
public interface EquivalentCourseRepository extends JpaRepository<EquivalentCourse, UUID> {

    @Override
    @EntityGraph(attributePaths = { "originalCourse", "equivalentCourse" })
    List<EquivalentCourse> findAll();
}
