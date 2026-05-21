package uni.it.stdmanager.modules.v_semester.service;

import uni.it.stdmanager.modules.v_semester.dto.request.SemesterRequest;
import uni.it.stdmanager.modules.v_semester.dto.response.SemesterResponse;

import java.util.List;
import java.util.UUID;

public interface SemesterService {
    List<SemesterResponse> getAllSemesters();
    SemesterResponse getSemesterById(UUID id);
    SemesterResponse getActiveSemester();
    SemesterResponse createSemester(SemesterRequest request);
    SemesterResponse updateSemester(UUID id, SemesterRequest request);
    void deleteSemester(UUID id);
}
