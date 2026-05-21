package uni.it.stdmanager.modules.iii_lecturer.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.modules.iii_lecturer.dto.response.DepartmentResponse;
import uni.it.stdmanager.modules.iii_lecturer.repository.DepartmentRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Override
    public List<DepartmentResponse> getAllActiveDepartments() {
        return departmentRepository.findAllByIsActiveTrue().stream()
                .map(dept -> DepartmentResponse.builder()
                        .id(dept.getId())
                        .code(dept.getCode())
                        .name(dept.getDepartmentName())
                        .build())
                .collect(Collectors.toList());
    }
}
