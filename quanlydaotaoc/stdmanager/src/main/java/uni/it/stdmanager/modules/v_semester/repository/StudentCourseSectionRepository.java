package uni.it.stdmanager.modules.v_semester.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.v_semester.entity.StudentCourseSection;

import java.util.List;
import java.util.UUID;

@Repository
public interface StudentCourseSectionRepository extends JpaRepository<StudentCourseSection, UUID> {
    List<StudentCourseSection> findAllByStudentId(UUID studentId);
    List<StudentCourseSection> findAllByCourseSectionId(UUID courseSectionId);
}
