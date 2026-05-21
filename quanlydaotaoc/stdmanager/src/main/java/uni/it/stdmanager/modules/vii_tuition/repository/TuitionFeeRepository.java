package uni.it.stdmanager.modules.vii_tuition.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.vii_tuition.entity.TuitionFee;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TuitionFeeRepository extends JpaRepository<TuitionFee, UUID> {

    Optional<TuitionFee> findFirstByProgramIdAndCourseYearAndIsActiveTrue(UUID programId, String courseYear);

    @Query("SELECT tf FROM TuitionFee tf WHERE tf.isActive = true AND " +
           "(:programId IS NULL OR tf.program.id = :programId) AND " +
           "(:courseYear IS NULL OR tf.courseYear = :courseYear)")
    Page<TuitionFee> searchTuitionFees(@Param("programId") UUID programId,
                                       @Param("courseYear") String courseYear,
                                       Pageable pageable);
}
