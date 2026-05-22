package uni.it.stdmanager.modules.vii_tuition.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.vi_registration.entity.CourseRegistration;
import uni.it.stdmanager.modules.vii_tuition.entity.StudentTuition;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentTuitionRepository extends JpaRepository<StudentTuition, UUID> {

    Optional<StudentTuition> findByStudentIdAndSemesterIdAndIsActiveTrue(UUID studentId, UUID semesterId);

    List<StudentTuition> findAllByStudentId(UUID studentId);

    @EntityGraph(attributePaths = { "student", "student.studentClass", "semester", "tuitionFee" })
    @Query("SELECT st FROM StudentTuition st WHERE st.isActive = true AND " +
            "(:semesterId IS NULL OR st.semester.id = :semesterId) AND " +
            "(:classId IS NULL OR st.student.studentClass.id = :classId) AND " +
            "(:status IS NULL OR st.status = :status) AND " +
            "(:keyword IS NULL OR LOWER(st.student.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(st.student.studentCode) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<StudentTuition> searchStudentTuitions(@Param("semesterId") UUID semesterId,
            @Param("classId") UUID classId,
            @Param("status") Integer status,
            @Param("keyword") String keyword,
            Pageable pageable);

    @Query("SELECT DISTINCT cr.student.id FROM CourseRegistration cr WHERE cr.courseSection.semester.id = :semesterId AND cr.isActive = true AND cr.status IN (1, 2)")
    List<UUID> findStudentIdsWithRegistrations(@Param("semesterId") UUID semesterId);
}
