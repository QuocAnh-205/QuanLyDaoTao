package uni.it.stdmanager.modules.i_auth.service;

import uni.it.stdmanager.modules.i_auth.dto.response.UserProfileResponse;

public interface UserProfileService {

    /**
     * Lấy thông tin profile đầy đủ của người dùng đang đăng nhập.
     */
    UserProfileResponse getCurrentUserProfile();

    /**
     * Cập nhật thông tin cơ bản của profile.
     */
    UserProfileResponse updateProfile(uni.it.stdmanager.modules.i_auth.dto.request.ProfileUpdateRequest request);

    /**
     * Cập nhật ảnh đại diện.
     */
    String updateAvatar(org.springframework.web.multipart.MultipartFile file);
}
