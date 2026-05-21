package uni.it.stdmanager.modules.iii_lecturer.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import uni.it.stdmanager.modules.iii_lecturer.dto.request.EmployeeRequest;
import uni.it.stdmanager.modules.iii_lecturer.dto.response.EmployeeResponse;

import java.util.UUID;

public interface EmployeeService {
    Page<EmployeeResponse> searchEmployees(String keyword, UUID departmentId, UUID positionId, Pageable pageable);
    EmployeeResponse getEmployeeById(UUID id);
    EmployeeResponse createEmployee(EmployeeRequest request);
    EmployeeResponse updateEmployee(UUID id, EmployeeRequest request);
    void deleteEmployee(UUID id);
}
