package uni.it.stdmanager.modules.vii_tuition.dto.request;

import lombok.Data;
import java.util.UUID;

@Data
public class StudentTuitionSearchRequest {
    private String keyword;
    private UUID semesterId;
    private UUID classId;
    private Integer status; // 1-PAID, 2-PARTIAL, 3-DEBT, 4-OVERDUE
    private int page = 0;
    private int size = 10;
    private String sortBy = "createdAt";
    private String sortDir = "desc";
}
