package uni.it.stdmanager.modules.viii_grade.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentTranscriptResponse {
    private UUID studentId;
    private String studentCode;
    private String studentName;
    private List<SemesterTranscript> semesters;
    private BigDecimal cumulativeGpa;
    private BigDecimal cumulativeGpa10; // GPA on 10-point scale
    private Integer totalCreditsRegistered;
    private Integer totalCreditsEarned;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SemesterTranscript {
        private UUID semesterId;
        private String semesterCode;
        private String semesterName;
        private List<CourseGrade> courses;
        private BigDecimal semesterGpa;
        private Integer semesterCredits;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CourseGrade {
        private UUID registrationId;
        private String courseCode;
        private String courseName;
        private BigDecimal credits;
        private BigDecimal totalScore;
        private String letterGrade;
        private BigDecimal gpaValue;
        private String result;
        private Boolean isFinalized;
    }
}
