package uni.it.stdmanager.modules.iii_lecturer.service;

import uni.it.stdmanager.modules.iii_lecturer.dto.response.DepartmentResponse;
import java.util.List;

public interface DepartmentService {
    List<DepartmentResponse> getAllActiveDepartments();
}
