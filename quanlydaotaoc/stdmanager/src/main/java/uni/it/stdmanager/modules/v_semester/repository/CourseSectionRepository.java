package uni.it.stdmanager.modules.v_semester.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.v_semester.entity.CourseSection;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseSectionRepository extends JpaRepository<CourseSection, UUID> {
    Optional<CourseSection> findByClassCode(String classCode);
    List<CourseSection> findAllBySemesterId(UUID semesterId);
}
