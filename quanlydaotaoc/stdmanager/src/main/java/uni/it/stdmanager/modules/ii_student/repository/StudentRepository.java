package uni.it.stdmanager.modules.ii_student.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.ii_student.entity.Student;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentRepository extends JpaRepository<Student, UUID> {

    Optional<Student> findByStudentCode(String studentCode);

    Optional<Student> findByUserId(UUID userId);

    boolean existsByStudentCode(String studentCode);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"user", "studentClass", "department", "major", "program", "currentStatus"})
    @Query("SELECT s FROM Student s WHERE s.isActive = true AND " +
            "(:keyword IS NULL OR LOWER(s.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.studentCode) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND "
            +
            "(:classId IS NULL OR s.studentClass.id = :classId) AND " +
            "(:statusId IS NULL OR s.currentStatus.id = :statusId)")
    Page<Student> searchStudents(@Param("keyword") String keyword,
            @Param("classId") UUID classId,
            @Param("statusId") UUID statusId,
            Pageable pageable);
}