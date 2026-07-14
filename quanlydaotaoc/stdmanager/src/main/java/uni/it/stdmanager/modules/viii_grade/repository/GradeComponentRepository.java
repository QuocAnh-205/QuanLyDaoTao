package uni.it.stdmanager.modules.viii_grade.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.viii_grade.entity.GradeComponent;

import java.util.List;
import java.util.UUID;

@Repository
public interface GradeComponentRepository extends JpaRepository<GradeComponent, UUID> {
    List<GradeComponent> findAllByCourseSectionIdAndIsActiveTrueOrderByInputOrderAsc(UUID courseSectionId);
    List<GradeComponent> findAllByCourseSectionId(UUID courseSectionId);
}
