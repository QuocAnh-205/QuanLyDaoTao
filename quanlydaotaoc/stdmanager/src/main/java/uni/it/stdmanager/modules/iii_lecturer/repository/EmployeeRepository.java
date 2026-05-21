package uni.it.stdmanager.modules.iii_lecturer.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.iii_lecturer.entity.Employee;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, UUID> {

    Optional<Employee> findByEmployeeCode(String employeeCode);

    Optional<Employee> findByUserId(UUID userId);

    boolean existsByEmployeeCode(String employeeCode);

    @EntityGraph(attributePaths = {"user", "department", "position"})
    @Query("SELECT e FROM Employee e WHERE " +
            "(:keyword IS NULL OR LOWER(e.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(e.employeeCode) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:departmentId IS NULL OR e.department.id = :departmentId) AND " +
            "(:positionId IS NULL OR e.position.id = :positionId)")
    Page<Employee> searchEmployees(@Param("keyword") String keyword,
                                   @Param("departmentId") UUID departmentId,
                                   @Param("positionId") UUID positionId,
                                   Pageable pageable);
}
