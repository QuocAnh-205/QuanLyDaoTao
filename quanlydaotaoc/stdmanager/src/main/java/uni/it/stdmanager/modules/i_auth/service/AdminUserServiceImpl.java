package uni.it.stdmanager.modules.i_auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.core.exception.AppException;
import uni.it.stdmanager.core.exception.ErrorCode;
import uni.it.stdmanager.modules.i_auth.dto.request.AdminUserRequest;
import uni.it.stdmanager.modules.i_auth.dto.request.AssignRoleRequest;
import uni.it.stdmanager.modules.i_auth.dto.response.AdminUserResponse;
import uni.it.stdmanager.modules.i_auth.entity.Role;
import uni.it.stdmanager.modules.i_auth.entity.User;
import uni.it.stdmanager.modules.i_auth.entity.UserRole;
import uni.it.stdmanager.modules.i_auth.repository.RoleRepository;
import uni.it.stdmanager.modules.i_auth.repository.UserRepository;
import uni.it.stdmanager.modules.i_auth.repository.UserRoleRepository;
import uni.it.stdmanager.modules.ii_student.repository.StudentRepository;
import uni.it.stdmanager.modules.iii_lecturer.repository.EmployeeRepository;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final StudentRepository studentRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    public Page<AdminUserResponse> getAllUsers(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> users = userRepository.searchByKeyword(keyword, pageable);
        return users.map(this::mapToResponse);
    }

    @Override
    public AdminUserResponse getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return mapToResponse(user);
    }

    @Override
    @Transactional
    public AdminUserResponse createUser(AdminUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        if (request.getEmail() != null && !request.getEmail().isBlank()
                && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng bởi tài khoản khác");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new RuntimeException("Mật khẩu là bắt buộc khi tạo tài khoản mới");
        }

        User user = User.builder()
                .username(request.getUsername())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .build();

        // isActive mặc định true nếu không chỉ định
        if (request.getIsActive() != null) {
            user.setIsActive(request.getIsActive());
        }

        user = userRepository.save(user);

        // Gán vai trò mặc định SINHVIEN
        Role defaultRole = roleRepository.findByCode("SINHVIEN")
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vai trò SINHVIEN"));
        UserRole userRole = UserRole.builder().user(user).role(defaultRole).build();
        userRoleRepository.save(userRole);

        return mapToResponse(user);
    }

    @Override
    @Transactional
    public AdminUserResponse updateUser(UUID id, AdminUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Kiểm tra username trùng (nếu thay đổi)
        if (!user.getUsername().equals(request.getUsername())
                && userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        // Kiểm tra email trùng (nếu thay đổi)
        if (request.getEmail() != null && !request.getEmail().isBlank()
                && !request.getEmail().equals(user.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng bởi tài khoản khác");
        }

        user.setUsername(request.getUsername());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        // Chỉ cập nhật mật khẩu nếu được cung cấp
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getIsActive() != null) {
            user.setIsActive(request.getIsActive());
        }

        userRepository.save(user);
        return mapToResponse(user);
    }

    @Override
    @Transactional
    public AdminUserResponse toggleUserStatus(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        user.setIsActive(!Boolean.TRUE.equals(user.getIsActive()));
        userRepository.save(user);
        return mapToResponse(user);
    }

    @Override
    @Transactional
    public AdminUserResponse assignRoles(UUID id, AssignRoleRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Xoá toàn bộ roles cũ
        userRoleRepository.deleteAllByUser(user);

        // Gán roles mới
        if (request.getRoleCodes() != null && !request.getRoleCodes().isEmpty()) {
            for (String code : request.getRoleCodes()) {
                Role role = roleRepository.findByCode(code)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy vai trò: " + code));
                UserRole userRole = UserRole.builder().user(user).role(role).build();
                userRoleRepository.save(userRole);
            }
        }

        return mapToResponse(user);
    }

    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    // ======== Mapping Helper ========

    private AdminUserResponse mapToResponse(User user) {
        // Lấy roles
        Set<AdminUserResponse.RoleInfo> roleInfos = userRoleRepository.findAllByUser(user).stream()
                .map(ur -> AdminUserResponse.RoleInfo.builder()
                        .id(ur.getRole().getId())
                        .code(ur.getRole().getCode())
                        .name(ur.getRole().getName())
                        .build())
                .collect(Collectors.toSet());

        // Xác định profileType
        String profileType = null;
        if (studentRepository.findByUserId(user.getId()).isPresent()) {
            profileType = "STUDENT";
        } else if (employeeRepository.findByUserId(user.getId()).isPresent()) {
            profileType = "EMPLOYEE";
        }

        return AdminUserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .isActive(user.getIsActive())
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .roles(roleInfos)
                .profileType(profileType)
                .build();
    }
}
