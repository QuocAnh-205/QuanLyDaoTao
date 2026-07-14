package uni.it.stdmanager.modules.i_auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import uni.it.stdmanager.core.exception.AppException;
import uni.it.stdmanager.core.exception.ErrorCode;
import uni.it.stdmanager.core.security.JwtService;
import uni.it.stdmanager.modules.i_auth.dto.request.*;
import uni.it.stdmanager.modules.i_auth.dto.response.AuthenticationResponse;
import uni.it.stdmanager.modules.i_auth.dto.response.IntrospectResponse;
import uni.it.stdmanager.modules.i_auth.entity.User;
import uni.it.stdmanager.modules.i_auth.entity.UserRole;
import uni.it.stdmanager.modules.i_auth.entity.Role;
import uni.it.stdmanager.modules.i_auth.repository.UserRepository;
import uni.it.stdmanager.modules.i_auth.repository.UserRoleRepository;
import uni.it.stdmanager.modules.i_auth.repository.RoleRepository;
import org.springframework.transaction.annotation.Transactional; // Thêm import này
import uni.it.stdmanager.modules.ii_student.entity.Student;
import uni.it.stdmanager.modules.ii_student.repository.StudentRepository;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional // Thêm Annotation này để bao bọc toàn bộ các hàm trong class bằng 1 Transaction
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;
    private final StudentRepository studentRepository;

    @Override
    public AuthenticationResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());
        if (!authenticated) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        if (!user.getIsActive()) {
            throw new AppException(ErrorCode.UNAUTHORIZED); // Hoặc tạo thêm ErrorCode.USER_LOCKED
        }

        // Cập nhật last_login_at
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        // Lấy danh sách Role
        List<UserRole> userRoles = userRoleRepository.findAllByUser(user);
        Set<String> roles = userRoles.stream()
                .map(ur -> ur.getRole().getCode())
                .collect(Collectors.toSet());

        // Đưa roles vào payload (claims) của JWT
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("roles", roles);

        CustomUserDetails userDetails = new CustomUserDetails(user, roles);
        String token = jwtService.generateToken(extraClaims, userDetails);

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .user(AuthenticationResponse.UserResponse.builder()
                        .username(user.getUsername())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .avatarUrl(user.getAvatarUrl())
                        .roles(roles)
                        .build())
                .build();
    }

    @Override
    public IntrospectResponse introspect(IntrospectRequest request) {
        boolean isValid = true;
        try {
            String username = jwtService.extractUsername(request.getToken());
            CustomUserDetails userDetails = (CustomUserDetails) userDetailsService.loadUserByUsername(username);
            isValid = jwtService.isTokenValid(request.getToken(), userDetails);
        } catch (Exception e) {
            isValid = false;
        }

        return IntrospectResponse.builder()
                .valid(isValid)
                .build();
    }

    @Override
    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng");
        }
        if (studentRepository.existsByStudentCode(request.getUsername())) {
            throw new RuntimeException("Mã số sinh viên đã tồn tại");
        }

        User user = User.builder()
                .username(request.getUsername())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .build();

        user = userRepository.save(user);

        // Gán Role mặc định: SINHVIEN
        Role role = roleRepository.findByCode("SINHVIEN")
                .orElseThrow(() -> new RuntimeException("Lỗi hệ thống: Không tìm thấy vai trò SINHVIEN"));

        UserRole userRole = UserRole.builder()
                .user(user)
                .role(role)
                .build();

        userRoleRepository.save(userRole);

        // Tạo hồ sơ Sinh viên tương ứng liên kết với User
        Student student = Student.builder()
                .user(user)
                .studentCode(user.getUsername())
                .fullName(user.getFullName())
                .build();
        student.setIsActive(true);
        studentRepository.save(student);
    }

    @Override
    @Transactional(readOnly = true)
    public void processForgotPassword(ForgotPasswordRequest request) {
        // Kiểm tra xem email có tồn tại không
        userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Giả lập gửi OTP về email (in ra log console để kiểm tra)
        System.out.println("[SMTP SIMULATION] Gửi OTP đặt lại mật khẩu đến: " + request.getEmail() + " | OTP: 123456");
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!"123456".equals(request.getOtp())) {
            throw new RuntimeException("Mã xác thực OTP không chính xác");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}