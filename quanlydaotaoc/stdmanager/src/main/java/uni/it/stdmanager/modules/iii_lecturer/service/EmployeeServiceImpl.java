package uni.it.stdmanager.modules.iii_lecturer.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.modules.i_auth.entity.Role;
import uni.it.stdmanager.modules.i_auth.entity.User;
import uni.it.stdmanager.modules.i_auth.entity.UserRole;
import uni.it.stdmanager.modules.i_auth.repository.RoleRepository;
import uni.it.stdmanager.modules.i_auth.repository.UserRepository;
import uni.it.stdmanager.modules.i_auth.repository.UserRoleRepository;
import uni.it.stdmanager.modules.iii_lecturer.dto.request.EmployeeRequest;
import uni.it.stdmanager.modules.iii_lecturer.dto.response.EmployeeResponse;
import uni.it.stdmanager.modules.iii_lecturer.entity.Department;
import uni.it.stdmanager.modules.iii_lecturer.entity.Employee;
import uni.it.stdmanager.modules.iii_lecturer.entity.Position;
import uni.it.stdmanager.modules.iii_lecturer.repository.DepartmentRepository;
import uni.it.stdmanager.modules.iii_lecturer.repository.EmployeeRepository;
import uni.it.stdmanager.modules.iii_lecturer.repository.PositionRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Page<EmployeeResponse> searchEmployees(String keyword, UUID departmentId, UUID positionId, Pageable pageable) {
        Page<Employee> employees = employeeRepository.searchEmployees(keyword, departmentId, positionId, pageable);
        return employees.map(this::mapToResponse);
    }

    @Override
    public EmployeeResponse getEmployeeById(UUID id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên/giảng viên"));
        return mapToResponse(employee);
    }

    @Override
    @Transactional
    public EmployeeResponse createEmployee(EmployeeRequest request) {
        if (employeeRepository.existsByEmployeeCode(request.getEmployeeCode())) {
            throw new RuntimeException("Mã nhân viên đã tồn tại");
        }

        // Tạo User account
        User user = User.builder()
                .username(request.getEmployeeCode())
                .passwordHash(passwordEncoder.encode(request.getEmployeeCode()))
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .build();
        user = userRepository.save(user);

        // Gán Role GIANGVIEN mặc định
        Role role = roleRepository.findByCode("GIANGVIEN")
                .orElseThrow(() -> new RuntimeException("Lỗi cấu hình Role GIANGVIEN"));
        userRoleRepository.save(UserRole.builder().user(user).role(role).build());

        Department department = request.getDepartmentId() != null ? 
                departmentRepository.findById(request.getDepartmentId()).orElse(null) : null;
        Position position = request.getPositionId() != null ? 
                positionRepository.findById(request.getPositionId()).orElse(null) : null;

        Employee employee = Employee.builder()
                .user(user)
                .employeeCode(request.getEmployeeCode())
                .fullName(request.getFullName())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .department(department)
                .position(position)
                .hireDate(request.getHireDate())
                .contractType(request.getContractType())
                .salaryCoefficient(request.getSalaryCoefficient())
                .academicDegree(request.getAcademicDegree())
                .academicTitle(request.getAcademicTitle())
                .specialization(request.getSpecialization())
                .build();

        return mapToResponse(employeeRepository.save(employee));
    }

    @Override
    @Transactional
    public EmployeeResponse updateEmployee(UUID id, EmployeeRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên/giảng viên"));

        // Không cho phép đổi employeeCode ở đây (hoặc check trùng nếu cho phép)
        
        employee.setFullName(request.getFullName());
        employee.setDateOfBirth(request.getDateOfBirth());
        employee.setGender(request.getGender());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setAddress(request.getAddress());
        employee.setHireDate(request.getHireDate());
        employee.setContractType(request.getContractType());
        employee.setSalaryCoefficient(request.getSalaryCoefficient());
        employee.setAcademicDegree(request.getAcademicDegree());
        employee.setAcademicTitle(request.getAcademicTitle());
        employee.setSpecialization(request.getSpecialization());

        if (request.getDepartmentId() != null) {
            employee.setDepartment(departmentRepository.findById(request.getDepartmentId()).orElse(null));
        } else {
            employee.setDepartment(null);
        }

        if (request.getPositionId() != null) {
            employee.setPosition(positionRepository.findById(request.getPositionId()).orElse(null));
        } else {
            employee.setPosition(null);
        }

        // Update user info
        User user = employee.getUser();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        userRepository.save(user);

        return mapToResponse(employeeRepository.save(employee));
    }

    @Override
    @Transactional
    public void deleteEmployee(UUID id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên/giảng viên"));
        // Cần xử lý soft delete hoặc xóa các liên kết (contracts, degrees...)
        // Tạm thời set isActive = false
        employee.setIsActive(false);
        employee.getUser().setIsActive(false);
        employeeRepository.save(employee);
        userRepository.save(employee.getUser());
    }

    private EmployeeResponse mapToResponse(Employee employee) {
        return EmployeeResponse.builder()
                .id(employee.getId())
                .employeeCode(employee.getEmployeeCode())
                .fullName(employee.getFullName())
                .dateOfBirth(employee.getDateOfBirth())
                .gender(employee.getGender())
                .email(employee.getEmail())
                .phone(employee.getPhone())
                .address(employee.getAddress())
                .hireDate(employee.getHireDate())
                .contractType(employee.getContractType())
                .salaryCoefficient(employee.getSalaryCoefficient())
                .academicDegree(employee.getAcademicDegree())
                .academicTitle(employee.getAcademicTitle())
                .specialization(employee.getSpecialization())
                .departmentId(employee.getDepartment() != null ? employee.getDepartment().getId() : null)
                .departmentName(employee.getDepartment() != null ? employee.getDepartment().getDepartmentName() : null)
                .positionId(employee.getPosition() != null ? employee.getPosition().getId() : null)
                .positionName(employee.getPosition() != null ? employee.getPosition().getName() : null)
                .build();
    }
}
