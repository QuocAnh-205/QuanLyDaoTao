package uni.it.stdmanager.modules.viii_grade.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.viii_grade.entity.GradeScale;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GradeScaleRepository extends JpaRepository<GradeScale, UUID> {

    @Query("SELECT gs FROM GradeScale gs WHERE gs.isActive = true AND :score >= gs.minScore AND :score <= gs.maxScore")
    Optional<GradeScale> findScaleForScore(BigDecimal score);
}
