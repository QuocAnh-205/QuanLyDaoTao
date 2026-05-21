package uni.it.stdmanager.modules.vii_tuition.service;

import org.springframework.data.domain.Page;
import uni.it.stdmanager.modules.vii_tuition.dto.request.ManualTuitionRequest;
import uni.it.stdmanager.modules.vii_tuition.dto.request.StudentTuitionAdjustRequest;
import uni.it.stdmanager.modules.vii_tuition.dto.request.StudentTuitionSearchRequest;
import uni.it.stdmanager.modules.vii_tuition.dto.response.StudentTuitionResponse;

import java.util.UUID;

public interface StudentTuitionService {
    Page<StudentTuitionResponse> searchStudentTuitions(StudentTuitionSearchRequest request);
    StudentTuitionResponse getStudentTuitionById(UUID id);
    StudentTuitionResponse calculateTuition(UUID studentId, UUID semesterId);
    void calculateTuitionForAll(UUID semesterId);
    StudentTuitionResponse adjustTuition(UUID id, StudentTuitionAdjustRequest request);
    StudentTuitionResponse createManualTuition(ManualTuitionRequest request);
    void deleteTuition(UUID id);
}
