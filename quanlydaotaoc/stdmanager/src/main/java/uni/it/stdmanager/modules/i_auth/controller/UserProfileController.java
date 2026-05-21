package uni.it.stdmanager.modules.i_auth.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.i_auth.dto.request.ProfileUpdateRequest;
import uni.it.stdmanager.modules.i_auth.dto.response.UserProfileResponse;
import uni.it.stdmanager.modules.i_auth.service.UserProfileService;

@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
@Tag(name = "I. Auth Module", description = "API Xác thực và Quản lý truy cập")
public class UserProfileController {

    private final UserProfileService userProfileService;

    @GetMapping
    @Operation(summary = "4. Xem Profile cá nhân", description = "Lấy đầy đủ thông tin tài khoản, vai trò, và hồ sơ liên kết (Sinh viên/Cán bộ) của người dùng đang đăng nhập")
    public ApiResponse<UserProfileResponse> getMyProfile() {
        UserProfileResponse profile = userProfileService.getCurrentUserProfile();
        return ApiResponse.success(profile, "Lấy thông tin profile thành công");
    }

    @PutMapping
    @Operation(summary = "5. Cập nhật Profile", description = "Cập nhật thông tin họ tên, email, số điện thoại của người dùng hiện tại")
    public ApiResponse<UserProfileResponse> updateProfile(@Valid @RequestBody ProfileUpdateRequest request) {
        UserProfileResponse profile = userProfileService.updateProfile(request);
        return ApiResponse.success(profile, "Cập nhật thông tin thành công");
    }

    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "6. Tải lên Avatar", description = "Cập nhật ảnh đại diện mới cho người dùng")
    public ApiResponse<String> uploadAvatar(@RequestParam("file") MultipartFile file) {
        String avatarUrl = userProfileService.updateAvatar(file);
        return ApiResponse.success(avatarUrl, "Cập nhật ảnh đại diện thành công");
    }
}
