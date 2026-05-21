package uni.it.stdmanager.modules.vi_registration.service;

import uni.it.stdmanager.modules.vi_registration.dto.request.EquivalentCourseRequest;
import uni.it.stdmanager.modules.vi_registration.dto.response.EquivalentCourseResponse;

import java.util.List;
import java.util.UUID;

public interface EquivalentCourseService {
    List<EquivalentCourseResponse> getAll();
    EquivalentCourseResponse create(EquivalentCourseRequest request);
    void delete(UUID id);
}
