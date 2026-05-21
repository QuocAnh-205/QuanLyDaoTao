package uni.it.stdmanager.modules.vii_tuition.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private UUID id;
    private UUID tuitionId;
    private String studentCode;
    private String studentName;
    private String semesterName;
    private BigDecimal amountPaid;
    private LocalDateTime paymentDate;
    private Integer paymentMethod;
    private String paymentStatus;
    private String transactionRef;
    private UUID cashierId;
    private String notes;
}
