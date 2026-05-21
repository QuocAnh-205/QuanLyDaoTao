package uni.it.stdmanager.core.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(info = @Info(title = "University IT Management System API (stdmanager)", description = "Tài liệu API chính thức cho các Module nghiệp vụ", version = "1.0", contact = @Contact(name = "Dev Team", email = "dev@uda.edu.vn")),
        // Áp dụng yêu cầu bảo mật này cho toàn bộ API (ngoại trừ những API public)
        security = {
                @SecurityRequirement(name = "bearerAuth")
        })
@SecurityScheme(name = "bearerAuth", description = "Dán mã JWT Token vào đây để xác thực. Không cần thêm từ 'Bearer ' phía trước.", scheme = "bearer", type = SecuritySchemeType.HTTP, bearerFormat = "JWT", in = SecuritySchemeIn.HEADER)
public class OpenApiConfig {
}