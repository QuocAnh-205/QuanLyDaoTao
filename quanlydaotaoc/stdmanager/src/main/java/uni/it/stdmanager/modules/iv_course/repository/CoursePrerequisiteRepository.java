package uni.it.stdmanager.modules.iv_course.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.iv_course.entity.CoursePrerequisite;

import java.util.List;
import java.util.UUID;

@Repository
public interface CoursePrerequisiteRepository extends JpaRepository<CoursePrerequisite, UUID> {
    List<CoursePrerequisite> findAllByCourseId(UUID courseId);
}
