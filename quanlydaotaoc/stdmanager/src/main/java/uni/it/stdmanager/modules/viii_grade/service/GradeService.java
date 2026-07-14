package uni.it.stdmanager.modules.viii_grade.service;

import uni.it.stdmanager.modules.viii_grade.dto.request.BulkSubmitGradesRequest;
import uni.it.stdmanager.modules.viii_grade.dto.request.GradeComponentRequest;
import uni.it.stdmanager.modules.viii_grade.dto.response.GradeComponentResponse;
import uni.it.stdmanager.modules.viii_grade.dto.response.StudentGradeDetailResponse;
import uni.it.stdmanager.modules.viii_grade.dto.response.StudentTranscriptResponse;

import java.util.List;
import java.util.UUID;

public interface GradeService {
    List<GradeComponentResponse> getComponents(UUID sectionId);
    List<GradeComponentResponse> configureComponents(UUID sectionId, List<GradeComponentRequest> requests);
    List<StudentGradeDetailResponse> getStudentGrades(UUID sectionId);
    void submitGrades(UUID sectionId, BulkSubmitGradesRequest request, UUID graderId);
    StudentTranscriptResponse getStudentTranscript(UUID studentId);
}
