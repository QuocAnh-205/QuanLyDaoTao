package uni.it.stdmanager.modules.v_semester.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseSectionResponse {
    private UUID id;
    private String classCode;
    private UUID courseId;
    private String courseCode;
    private String courseName;
    private UUID semesterId;
    private String semesterName;
    private UUID lecturerId;
    private String lecturerName;
    private UUID roomId;
    private UUID buildingId;
    private Integer maxStudents;
    private Integer minStudents;
    private Integer currentStudents;
    private String classType;
    private String status;
    private LocalDateTime registrationStart;
    private LocalDateTime registrationEnd;
    private String note;
}
