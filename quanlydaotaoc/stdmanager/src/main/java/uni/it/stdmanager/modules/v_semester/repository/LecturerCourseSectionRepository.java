package uni.it.stdmanager.modules.v_semester.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.v_semester.entity.LecturerCourseSection;

import java.util.List;
import java.util.UUID;

@Repository
public interface LecturerCourseSectionRepository extends JpaRepository<LecturerCourseSection, UUID> {
    List<LecturerCourseSection> findAllByCourseSectionId(UUID courseSectionId);
    List<LecturerCourseSection> findAllByLecturerId(UUID lecturerId);
}
