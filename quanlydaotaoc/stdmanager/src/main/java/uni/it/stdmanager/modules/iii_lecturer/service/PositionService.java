package uni.it.stdmanager.modules.iii_lecturer.service;

import uni.it.stdmanager.modules.iii_lecturer.dto.response.PositionResponse;
import java.util.List;

public interface PositionService {
    List<PositionResponse> getAllActivePositions();
}
