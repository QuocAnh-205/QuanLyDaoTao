package uni.it.stdmanager.modules.viii_grade.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.core.security.SecurityUtils;
import uni.it.stdmanager.modules.i_auth.entity.User;
import uni.it.stdmanager.modules.i_auth.repository.UserRepository;
import uni.it.stdmanager.modules.viii_grade.dto.request.BulkSubmitGradesRequest;
import uni.it.stdmanager.modules.viii_grade.dto.request.GradeComponentRequest;
import uni.it.stdmanager.modules.viii_grade.dto.response.GradeComponentResponse;
import uni.it.stdmanager.modules.viii_grade.dto.response.StudentGradeDetailResponse;
import uni.it.stdmanager.modules.viii_grade.dto.response.StudentTranscriptResponse;
import uni.it.stdmanager.modules.viii_grade.service.GradeService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/grades")
@RequiredArgsConstructor
@Tag(name = "VIII. Grade Module", description = "API Quản lý Điểm & Kết quả học tập")
public class GradeController {

    private final GradeService gradeService;
    private final UserRepository userRepository;
    private final uni.it.stdmanager.modules.ii_student.repository.StudentRepository studentRepository;

    @GetMapping("/sections/{sectionId}/components")
    @Operation(summary = "1. Xem cấu hình trọng số điểm của lớp học phần")
    public ApiResponse<List<GradeComponentResponse>> getComponents(@PathVariable UUID sectionId) {
        return ApiResponse.success(gradeService.getComponents(sectionId), "Lấy danh sách cấu hình điểm thành công");
    }

    @PostMapping("/sections/{sectionId}/components")
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN', 'GIANGVIEN')")
    @Operation(summary = "2. Thiết lập trọng số điểm cho lớp học phần (Tổng = 100%)")
    public ApiResponse<List<GradeComponentResponse>> configureComponents(
            @PathVariable UUID sectionId,
            @RequestBody List<GradeComponentRequest> requests) {
        return ApiResponse.success(gradeService.configureComponents(sectionId, requests), "Thiết lập trọng số điểm thành công");
    }

    @GetMapping("/sections/{sectionId}/students")
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN', 'GIANGVIEN')")
    @Operation(summary = "3. Lấy danh sách điểm sinh viên của lớp học phần")
    public ApiResponse<List<StudentGradeDetailResponse>> getStudentGrades(@PathVariable UUID sectionId) {
        return ApiResponse.success(gradeService.getStudentGrades(sectionId), "Lấy danh sách điểm lớp học phần thành công");
    }

    @PostMapping("/sections/{sectionId}/grades")
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN', 'GIANGVIEN')")
    @Operation(summary = "4. Nhập điểm hoặc Khóa điểm hàng loạt cho lớp học phần")
    public ApiResponse<Void> submitGrades(
            @PathVariable UUID sectionId,
            @RequestBody BulkSubmitGradesRequest request) {
        
        String username = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new RuntimeException("Chưa đăng nhập"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        gradeService.submitGrades(sectionId, request, user.getId());
        return ApiResponse.success(null, request.getFinalize() ? "Khóa điểm thành công" : "Lưu điểm nháp thành công");
    }

    @GetMapping("/students/{studentId}/transcript")
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "5. Xem bảng điểm cá nhân của sinh viên")
    public ApiResponse<StudentTranscriptResponse> getStudentTranscript(@PathVariable UUID studentId) {
        return ApiResponse.success(gradeService.getStudentTranscript(studentId), "Lấy bảng điểm thành công");
    }

    @GetMapping("/my-transcript")
    @PreAuthorize("hasRole('SINHVIEN')")
    @Operation(summary = "6. Xem bảng điểm cá nhân của sinh viên đang đăng nhập")
    public ApiResponse<StudentTranscriptResponse> getMyTranscript() {
        String username = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new RuntimeException("Chưa đăng nhập"));
        uni.it.stdmanager.modules.ii_student.entity.Student student = studentRepository.findByStudentCode(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin hồ sơ sinh viên"));
        return ApiResponse.success(gradeService.getStudentTranscript(student.getId()), "Lấy bảng điểm cá nhân thành công");
    }
}
