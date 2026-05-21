package uni.it.stdmanager.modules.iv_course.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.iv_course.entity.TrainingProgramCourse;

import java.util.List;
import java.util.UUID;

@Repository
public interface TrainingProgramCourseRepository extends JpaRepository<TrainingProgramCourse, UUID> {
    List<TrainingProgramCourse> findAllByTrainingProgramId(UUID trainingProgramId);
}
