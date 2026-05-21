package uni.it.stdmanager.modules.iii_lecturer.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.modules.iii_lecturer.dto.response.PositionResponse;
import uni.it.stdmanager.modules.iii_lecturer.repository.PositionRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PositionServiceImpl implements PositionService {

    private final PositionRepository positionRepository;

    @Override
    public List<PositionResponse> getAllActivePositions() {
        return positionRepository.findAllByIsActiveTrue().stream()
                .map(pos -> PositionResponse.builder()
                        .id(pos.getId())
                        .code(pos.getCode())
                        .name(pos.getName())
                        .level(pos.getLevel())
                        .build())
                .collect(Collectors.toList());
    }
}
