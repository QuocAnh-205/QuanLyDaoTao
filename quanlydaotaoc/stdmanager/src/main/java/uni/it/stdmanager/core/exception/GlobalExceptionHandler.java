package uni.it.stdmanager.core.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import uni.it.stdmanager.core.dto.ApiResponse;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Bắt lỗi nghiệp vụ do mình tự định nghĩa (AppException)
    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse<?>> handlingAppException(AppException exception) {
        ErrorCode errorCode = exception.getErrorCode();
        ApiResponse<?> apiResponse = new ApiResponse<>();

        apiResponse.setSuccess(false);
        apiResponse.setCode(String.valueOf(errorCode.getCode()));
        apiResponse.setMessage(errorCode.getMessage());
        apiResponse.setTimestamp(LocalDateTime.now());

        return ResponseEntity.status(errorCode.getStatusCode()).body(apiResponse);
    }

    // 2. Bắt lỗi Validation (Dữ liệu đầu vào không hợp lệ)
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse<?>> handlingValidation(MethodArgumentNotValidException exception) {
        String enumKey = exception.getFieldError().getDefaultMessage();
        ErrorCode errorCode = ErrorCode.INVALID_KEY;

        try {
            errorCode = ErrorCode.valueOf(enumKey);
        } catch (IllegalArgumentException e) {
            // Giữ nguyên mã lỗi mặc định nếu không khớp enum
        }

        ApiResponse<?> apiResponse = new ApiResponse<>();
        apiResponse.setSuccess(false);
        apiResponse.setCode(String.valueOf(errorCode.getCode()));
        apiResponse.setMessage(errorCode.getMessage());
        apiResponse.setTimestamp(LocalDateTime.now());

        return ResponseEntity.status(errorCode.getStatusCode()).body(apiResponse);
    }

    // 3. Bắt các lỗi hệ thống không xác định (RunTime, SQL...)
    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ApiResponse<?>> handlingRuntimeException(RuntimeException exception) {
        ApiResponse<?> apiResponse = new ApiResponse<>();

        apiResponse.setSuccess(false);
        apiResponse.setCode(String.valueOf(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode()));
        apiResponse.setMessage(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage());
        apiResponse.setTimestamp(LocalDateTime.now());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
    }

    // Bổ sung method này vào trong class GlobalExceptionHandler
    @ExceptionHandler(value = ResourceNotFoundException.class)
    ResponseEntity<ApiResponse<?>> handlingResourceNotFoundException(ResourceNotFoundException exception) {
        ApiResponse<?> apiResponse = new ApiResponse<>();

        apiResponse.setSuccess(false);
        apiResponse.setCode("404"); // Hoặc định nghĩa mã lỗi trong ErrorCode (vd: 1009)
        apiResponse.setMessage(exception.getMessage());
        apiResponse.setTimestamp(LocalDateTime.now());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
    }
}