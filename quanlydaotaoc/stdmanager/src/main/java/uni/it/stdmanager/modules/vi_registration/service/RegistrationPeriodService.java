package uni.it.stdmanager.modules.vi_registration.service;

import uni.it.stdmanager.modules.vi_registration.dto.request.RegistrationPeriodRequest;
import uni.it.stdmanager.modules.vi_registration.dto.response.RegistrationPeriodResponse;

import java.util.List;
import java.util.UUID;

public interface RegistrationPeriodService {
    List<RegistrationPeriodResponse> getAll();
    RegistrationPeriodResponse getById(UUID id);
    RegistrationPeriodResponse create(RegistrationPeriodRequest request);
    RegistrationPeriodResponse update(UUID id, RegistrationPeriodRequest request);
    void delete(UUID id);
}
