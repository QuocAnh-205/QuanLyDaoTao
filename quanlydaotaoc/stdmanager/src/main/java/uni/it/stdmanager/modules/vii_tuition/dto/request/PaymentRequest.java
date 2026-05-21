package uni.it.stdmanager.modules.vii_tuition.dto.request;

import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class PaymentRequest {
    private UUID tuitionId;
    private BigDecimal amountPaid;
    private Integer paymentMethod; // 1-Bank Transfer, 2-Cash, 3-E-wallet
    private String transactionRef;
    private String notes;
}
