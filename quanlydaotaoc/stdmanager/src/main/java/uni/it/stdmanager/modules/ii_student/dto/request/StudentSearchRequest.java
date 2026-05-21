package uni.it.stdmanager.modules.ii_student.dto.request;

import lombok.Data;
import java.util.UUID;

@Data
public class StudentSearchRequest {
    private String keyword; // Tìm theo tên hoặc mã SV
    private UUID classId;
    private UUID departmentId;
    private UUID statusId;
    private int page = 0;
    private int size = 10;
    private String sortBy = "studentCode";
    private String sortDir = "asc";
}