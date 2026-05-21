package uni.it.stdmanager.modules.v_semester.service;

import uni.it.stdmanager.modules.v_semester.dto.request.CourseSectionRequest;
import uni.it.stdmanager.modules.v_semester.dto.response.CourseSectionResponse;

import java.util.List;
import java.util.UUID;

public interface CourseSectionService {
    List<CourseSectionResponse> getSectionsBySemester(UUID semesterId);
    CourseSectionResponse getSectionById(UUID id);
    CourseSectionResponse createSection(CourseSectionRequest request);
    CourseSectionResponse updateSection(UUID id, CourseSectionRequest request);
    void deleteSection(UUID id);
}
