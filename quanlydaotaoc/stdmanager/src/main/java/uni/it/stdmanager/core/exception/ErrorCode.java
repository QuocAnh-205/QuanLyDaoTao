package uni.it.stdmanager.core.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Lỗi hệ thống không xác định", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Mã lỗi không hợp lệ", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "Người dùng đã tồn tại", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Tên đăng nhập phải có ít nhất 3 ký tự", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Mật khẩu phải có ít nhất 8 ký tự", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "Người dùng không tồn tại", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Chưa xác thực", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "Bạn không có quyền truy cập", HttpStatus.FORBIDDEN),
    INVALID_DOB(1008, "Tuổi của bạn phải ít nhất là {min}", HttpStatus.BAD_REQUEST),
    
    // Group VI: Registration
    REGISTRATION_PERIOD_NOT_FOUND(6001, "Không tìm thấy đợt đăng ký", HttpStatus.NOT_FOUND),
    REGISTRATION_PERIOD_CLOSED(6002, "Đợt đăng ký đã kết thúc hoặc chưa bắt đầu", HttpStatus.BAD_REQUEST),
    COURSE_SECTION_NOT_FOUND(6003, "Không tìm thấy lớp học phần", HttpStatus.NOT_FOUND),
    COURSE_SECTION_FULL(6004, "Lớp học phần đã đầy", HttpStatus.BAD_REQUEST),
    STUDENT_NOT_FOUND(6005, "Không tìm thấy sinh viên", HttpStatus.NOT_FOUND),
    CREDIT_LIMIT_EXCEEDED(6006, "Số tín chỉ đăng ký vượt quá giới hạn", HttpStatus.BAD_REQUEST),
    SCHEDULE_CONFLICT(6007, "Lịch học bị trùng", HttpStatus.BAD_REQUEST),
    ;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}