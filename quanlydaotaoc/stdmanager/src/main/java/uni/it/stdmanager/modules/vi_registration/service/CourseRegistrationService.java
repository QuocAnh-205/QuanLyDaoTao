package uni.it.stdmanager.modules.vi_registration.service;

import uni.it.stdmanager.modules.vi_registration.dto.request.CourseRegistrationRequest;
import uni.it.stdmanager.modules.vi_registration.dto.response.CourseRegistrationResponse;

import java.util.List;
import java.util.UUID;

public interface CourseRegistrationService {
    CourseRegistrationResponse register(CourseRegistrationRequest request);
    void cancel(UUID id);
    List<CourseRegistrationResponse> getByStudent(UUID studentId);
    List<CourseRegistrationResponse> getBySection(UUID sectionId);
}
