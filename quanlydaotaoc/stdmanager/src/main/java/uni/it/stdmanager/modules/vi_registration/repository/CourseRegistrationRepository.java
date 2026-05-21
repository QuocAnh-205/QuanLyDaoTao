package uni.it.stdmanager.modules.vi_registration.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.vi_registration.entity.CourseRegistration;

import java.util.UUID;
import java.util.List;

@Repository
public interface CourseRegistrationRepository extends JpaRepository<CourseRegistration, UUID> {
    long countByCourseSectionIdAndStatus(UUID courseSectionId, Integer status);

    boolean existsByStudentIdAndCourseSectionIdAndStatusIn(UUID studentId, UUID courseSectionId,
            List<Integer> statuses);

    @EntityGraph(attributePaths = { "student", "courseSection", "courseSection.course", "registrationPeriod" })
    List<CourseRegistration> findAllByStudentId(UUID studentId);

    @EntityGraph(attributePaths = { "student", "courseSection", "courseSection.course", "registrationPeriod" })
    List<CourseRegistration> findAllByCourseSectionId(UUID courseSectionId);

    @EntityGraph(attributePaths = { "student", "courseSection", "courseSection.course", "registrationPeriod" })
    List<CourseRegistration> findAllByStudentIdAndCourseSectionSemesterId(UUID studentId, UUID semesterId);
}
