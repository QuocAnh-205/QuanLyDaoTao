package uni.it.stdmanager.modules.vii_tuition.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.vii_tuition.entity.Payment;

import java.util.List;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {

       @EntityGraph(attributePaths = { "tuition", "tuition.student", "tuition.semester" })
       List<Payment> findAllByTuitionIdAndIsActiveTrueOrderByPaymentDateDesc(UUID tuitionId);

       @EntityGraph(attributePaths = { "tuition", "tuition.student", "tuition.semester" })
       @Query("SELECT p FROM Payment p WHERE p.isActive = true AND " +
                     "(:studentId IS NULL OR p.tuition.student.id = :studentId) AND " +
                     "(:semesterId IS NULL OR p.tuition.semester.id = :semesterId)")
       Page<Payment> searchPayments(@Param("studentId") UUID studentId,
                     @Param("semesterId") UUID semesterId,
                     Pageable pageable);
}
