package uni.it.stdmanager.modules.viii_grade.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.core.exception.AppException;
import uni.it.stdmanager.core.exception.ErrorCode;
import uni.it.stdmanager.modules.ii_student.entity.Student;
import uni.it.stdmanager.modules.ii_student.repository.StudentRepository;
import uni.it.stdmanager.modules.v_semester.entity.CourseSection;
import uni.it.stdmanager.modules.v_semester.entity.StudentCourseSection;
import uni.it.stdmanager.modules.v_semester.repository.CourseSectionRepository;
import uni.it.stdmanager.modules.v_semester.repository.StudentCourseSectionRepository;
import uni.it.stdmanager.modules.vi_registration.entity.CourseRegistration;
import uni.it.stdmanager.modules.vi_registration.repository.CourseRegistrationRepository;
import uni.it.stdmanager.modules.viii_grade.dto.request.BulkSubmitGradesRequest;
import uni.it.stdmanager.modules.viii_grade.service.GradeService;
import uni.it.stdmanager.modules.viii_grade.dto.request.GradeComponentRequest;
import uni.it.stdmanager.modules.viii_grade.dto.request.StudentComponentGradeInput;
import uni.it.stdmanager.modules.viii_grade.dto.request.SubmitGradesRequest;
import uni.it.stdmanager.modules.viii_grade.dto.response.GradeComponentResponse;
import uni.it.stdmanager.modules.viii_grade.dto.response.StudentGradeDetailResponse;
import uni.it.stdmanager.modules.viii_grade.dto.response.StudentTranscriptResponse;
import uni.it.stdmanager.modules.viii_grade.entity.GradeComponent;
import uni.it.stdmanager.modules.viii_grade.entity.GradeScale;
import uni.it.stdmanager.modules.viii_grade.entity.StudentComponentGrade;
import uni.it.stdmanager.modules.viii_grade.entity.StudentSummary;
import uni.it.stdmanager.modules.viii_grade.repository.GradeComponentRepository;
import uni.it.stdmanager.modules.viii_grade.repository.GradeScaleRepository;
import uni.it.stdmanager.modules.viii_grade.repository.StudentComponentGradeRepository;
import uni.it.stdmanager.modules.viii_grade.repository.StudentSummaryRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GradeServiceImpl implements GradeService {

    private final GradeComponentRepository gradeComponentRepository;
    private final GradeScaleRepository gradeScaleRepository;
    private final StudentComponentGradeRepository studentComponentGradeRepository;
    private final StudentSummaryRepository studentSummaryRepository;
    private final CourseSectionRepository courseSectionRepository;
    private final CourseRegistrationRepository courseRegistrationRepository;
    private final StudentCourseSectionRepository studentCourseSectionRepository;
    private final StudentRepository studentRepository;

    @Override
    public List<GradeComponentResponse> getComponents(UUID sectionId) {
        return gradeComponentRepository.findAllByCourseSectionIdAndIsActiveTrueOrderByInputOrderAsc(sectionId).stream()
                .map(this::mapToComponentResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<GradeComponentResponse> configureComponents(UUID sectionId, List<GradeComponentRequest> requests) {
        CourseSection section = courseSectionRepository.findById(sectionId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học phần"));

        // Validate weights sum to 100%
        BigDecimal totalWeight = requests.stream()
                .map(GradeComponentRequest::getWeightPercentage)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (totalWeight.compareTo(new BigDecimal("100.00")) != 0
                && totalWeight.compareTo(new BigDecimal("1.00")) != 0) {
            // Support both 100% (e.g. 30.00) or 1.0 (e.g. 0.3)
            if (totalWeight.compareTo(new BigDecimal("100")) != 0) {
                throw new RuntimeException("Tổng trọng số của các điểm thành phần phải bằng 100%");
            }
        }

        // Get existing components
        List<GradeComponent> existing = gradeComponentRepository.findAllByCourseSectionId(sectionId);
        Map<UUID, GradeComponent> existingMap = existing.stream()
                .collect(Collectors.toMap(GradeComponent::getId, gc -> gc));

        List<GradeComponent> toSave = new ArrayList<>();
        Set<UUID> keptIds = new HashSet<>();

        for (GradeComponentRequest req : requests) {
            GradeComponent gc;
            if (req.getId() != null && existingMap.containsKey(req.getId())) {
                gc = existingMap.get(req.getId());
                keptIds.add(req.getId());
            } else {
                gc = new GradeComponent();
                gc.setCourseSection(section);
            }
            gc.setComponentCode(req.getComponentCode());
            gc.setComponentName(req.getComponentName());
            gc.setWeightPercentage(req.getWeightPercentage());
            gc.setInputOrder(req.getInputOrder());
            gc.setNote(req.getNote());
            gc.setIsActive(true);
            toSave.add(gc);
        }

        // Deactivate components not in request
        for (GradeComponent gc : existing) {
            if (!keptIds.contains(gc.getId())) {
                gc.setIsActive(false);
                toSave.add(gc);
            }
        }

        return gradeComponentRepository.saveAll(toSave).stream()
                .filter(GradeComponent::getIsActive)
                .map(this::mapToComponentResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentGradeDetailResponse> getStudentGrades(UUID sectionId) {
        List<CourseRegistration> registrations = courseRegistrationRepository.findAllByCourseSectionId(sectionId);
        List<GradeComponent> components = gradeComponentRepository
                .findAllByCourseSectionIdAndIsActiveTrueOrderByInputOrderAsc(sectionId);

        List<StudentGradeDetailResponse> results = new ArrayList<>();

        for (CourseRegistration reg : registrations) {
            if (reg.getStatus() != 1 && reg.getStatus() != 2) {
                continue; // Skip cancelled registrations
            }

            List<StudentComponentGrade> compGrades = studentComponentGradeRepository
                    .findAllByRegistrationIdAndIsActiveTrue(reg.getId());
            Map<UUID, StudentComponentGrade> gradeMap = compGrades.stream()
                    .collect(Collectors.toMap(cg -> cg.getGradeComponent().getId(), cg -> cg));

            List<StudentGradeDetailResponse.ComponentGradeResponse> compGradeResponses = components.stream()
                    .map(comp -> {
                        StudentComponentGrade grade = gradeMap.get(comp.getId());
                        return StudentGradeDetailResponse.ComponentGradeResponse.builder()
                                .componentId(comp.getId())
                                .componentCode(comp.getComponentCode())
                                .componentGradeId(grade != null ? grade.getId() : null)
                                .score(grade != null ? grade.getScore() : null)
                                .isLocked(grade != null ? grade.getIsLocked() : false)
                                .note(grade != null ? grade.getNote() : "")
                                .build();
                    })
                    .collect(Collectors.toList());

            Optional<StudentSummary> summaryOpt = studentSummaryRepository.findByRegistrationId(reg.getId());

            results.add(StudentGradeDetailResponse.builder()
                    .registrationId(reg.getId())
                    .studentId(reg.getStudent().getId())
                    .studentCode(reg.getStudent().getStudentCode())
                    .studentName(reg.getStudent().getFullName())
                    .componentGrades(compGradeResponses)
                    .totalScore(summaryOpt.map(StudentSummary::getTotalScore).orElse(null))
                    .letterGrade(summaryOpt.map(StudentSummary::getLetterGrade).orElse(null))
                    .gpaValue(summaryOpt.map(StudentSummary::getGpaValue).orElse(null))
                    .result(summaryOpt.map(StudentSummary::getResult).orElse(null))
                    .isFinalized(summaryOpt.map(StudentSummary::getIsFinalized).orElse(false))
                    .build());
        }

        return results;
    }

    @Override
    @Transactional
    public void submitGrades(UUID sectionId, BulkSubmitGradesRequest request, UUID graderId) {
        List<GradeComponent> components = gradeComponentRepository
                .findAllByCourseSectionIdAndIsActiveTrueOrderByInputOrderAsc(sectionId);
        Map<UUID, GradeComponent> componentMap = components.stream()
                .collect(Collectors.toMap(GradeComponent::getId, c -> c));

        for (SubmitGradesRequest sub : request.getSubmissions()) {
            CourseRegistration reg = courseRegistrationRepository.findById(sub.getRegistrationId())
                    .orElseThrow(
                            () -> new RuntimeException("Không tìm thấy thông tin đăng ký: " + sub.getRegistrationId()));

            Optional<StudentSummary> summaryOpt = studentSummaryRepository.findByRegistrationId(reg.getId());
            if (summaryOpt.isPresent() && summaryOpt.get().getIsFinalized()) {
                throw new RuntimeException("Bảng điểm của sinh viên " + reg.getStudent().getFullName()
                        + " đã được khóa, không thể chỉnh sửa.");
            }

            List<StudentComponentGrade> gradesToSave = new ArrayList<>();
            Map<UUID, BigDecimal> scores = new HashMap<>();

            for (StudentComponentGradeInput input : sub.getGrades()) {
                GradeComponent comp = componentMap.get(input.getComponentId());
                if (comp == null)
                    continue;

                if (input.getScore() != null) {
                    if (input.getScore().compareTo(BigDecimal.ZERO) < 0
                            || input.getScore().compareTo(new BigDecimal("10.00")) > 0) {
                        throw new RuntimeException("Điểm số phải nằm trong khoảng từ 0 đến 10.");
                    }
                }

                Optional<StudentComponentGrade> gradeOpt = studentComponentGradeRepository
                        .findByRegistrationIdAndGradeComponentIdAndIsActiveTrue(reg.getId(), comp.getId());

                StudentComponentGrade grade = gradeOpt.orElseGet(() -> StudentComponentGrade.builder()
                        .registration(reg)
                        .gradeComponent(comp)
                        .build());

                grade.setScore(input.getScore());
                grade.setNote(input.getNote());
                grade.setGradedAt(LocalDateTime.now());
                grade.setGradedBy(graderId);
                grade.setIsActive(true);

                if (request.getFinalize()) {
                    grade.setIsLocked(true);
                }

                gradesToSave.add(grade);
                scores.put(comp.getId(), input.getScore());
            }

            studentComponentGradeRepository.saveAll(gradesToSave);

            // Calculate summaries (totalScore, letterGrade, gpaValue) if all grades are entered, even for draft saves
            boolean allGradesEntered = true;
            BigDecimal totalScore = BigDecimal.ZERO;

            for (GradeComponent comp : components) {
                BigDecimal score = scores.get(comp.getId());
                if (score == null) {
                    // Look up in database if not submitted in this request
                    Optional<StudentComponentGrade> dbGrade = studentComponentGradeRepository
                            .findByRegistrationIdAndGradeComponentIdAndIsActiveTrue(reg.getId(), comp.getId());
                    if (dbGrade.isPresent() && dbGrade.get().getScore() != null) {
                        score = dbGrade.get().getScore();
                    }
                }

                if (score == null) {
                    allGradesEntered = false;
                    break;
                }

                BigDecimal weight = comp.getWeightPercentage();
                if (weight.compareTo(BigDecimal.ONE) <= 0) {
                    weight = weight.multiply(new BigDecimal("100")); // normalized 0.3 -> 30
                }

                totalScore = totalScore.add(score.multiply(weight));
            }

            if (allGradesEntered) {
                totalScore = totalScore.divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);

                // Find scale
                final BigDecimal finalScore = totalScore;
                GradeScale scale = gradeScaleRepository.findScaleForScore(finalScore)
                        .orElseThrow(() -> new RuntimeException(
                                "Không tìm thấy thang điểm quy đổi cho điểm số: " + finalScore));

                StudentSummary summary = summaryOpt.orElseGet(() -> StudentSummary.builder()
                        .registration(reg)
                        .build());

                summary.setTotalScore(totalScore);
                summary.setGradeScale(scale);
                summary.setLetterGrade(scale.getLetterGrade());
                summary.setGpaValue(scale.getGpaValue());
                summary.setResult(scale.getIsPass() ? "PASS" : "FAIL");
                summary.setIsFinalized(request.getFinalize());
                summary.setIsActive(true);

                studentSummaryRepository.save(summary);

                // Sync with student_course_sections if exists
                List<StudentCourseSection> syncSections = studentCourseSectionRepository
                        .findAllByStudentId(reg.getStudent().getId());
                for (StudentCourseSection scs : syncSections) {
                    if (scs.getCourseSection().getId().equals(reg.getCourseSection().getId())) {
                        scs.setGradePoint(scale.getGpaValue());
                        scs.setGradeChar(scale.getLetterGrade());
                        if (request.getFinalize()) {
                            scs.setStatus("completed");
                        }
                        studentCourseSectionRepository.save(scs);
                    }
                }
            } else {
                // If grades are not complete and there was an unfinalized draft summary, clear it
                if (summaryOpt.isPresent() && !summaryOpt.get().getIsFinalized()) {
                    studentSummaryRepository.delete(summaryOpt.get());
                }
            }
        }
    }

    @Override
    public StudentTranscriptResponse getStudentTranscript(UUID studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));

        List<CourseRegistration> registrations = courseRegistrationRepository.findAllByStudentId(studentId);
        List<StudentSummary> summaries = studentSummaryRepository
                .findAllByRegistrationStudentIdAndIsActiveTrue(studentId);

        Map<UUID, StudentSummary> summaryMap = summaries.stream()
                .collect(Collectors.toMap(s -> s.getRegistration().getId(), s -> s));

        // Group by Semester
        Map<UUID, List<CourseRegistration>> registrationsBySemester = registrations.stream()
                .filter(r -> r.getStatus() == 1 || r.getStatus() == 2)
                .collect(Collectors.groupingBy(r -> r.getCourseSection().getSemester().getId()));

        List<StudentTranscriptResponse.SemesterTranscript> semesterTranscripts = new ArrayList<>();

        BigDecimal totalWeightedGpa = BigDecimal.ZERO;
        BigDecimal totalWeightedGpa10 = BigDecimal.ZERO;
        int totalCreditsRegistered = 0;
        int totalCreditsEarned = 0;

        for (Map.Entry<UUID, List<CourseRegistration>> entry : registrationsBySemester.entrySet()) {
            UUID semId = entry.getKey();
            List<CourseRegistration> semRegs = entry.getValue();

            CourseSection sampleSection = semRegs.get(0).getCourseSection();
            String semCode = sampleSection.getSemester().getSemesterCode();
            String semName = sampleSection.getSemester().getSemesterName();

            List<StudentTranscriptResponse.CourseGrade> courses = new ArrayList<>();
            BigDecimal semWeightedGpa = BigDecimal.ZERO;
            int semCredits = 0;

            for (CourseRegistration reg : semRegs) {
                StudentSummary summary = summaryMap.get(reg.getId());
                BigDecimal credits = reg.getCourseSection().getCourse().getCredits();
                semCredits += credits.intValue();

                StudentTranscriptResponse.CourseGrade cg = StudentTranscriptResponse.CourseGrade.builder()
                        .registrationId(reg.getId())
                        .courseCode(reg.getCourseSection().getCourse().getCourseCode())
                        .courseName(reg.getCourseSection().getCourse().getCourseName())
                        .credits(credits)
                        .isFinalized(false)
                        .build();

                if (summary != null) {
                    cg.setTotalScore(summary.getTotalScore());
                    cg.setLetterGrade(summary.getLetterGrade());
                    cg.setGpaValue(summary.getGpaValue());
                    cg.setResult(summary.getResult());
                    cg.setIsFinalized(summary.getIsFinalized());

                    if (summary.getIsFinalized()) {
                        semWeightedGpa = semWeightedGpa.add(summary.getGpaValue().multiply(credits));
                        totalWeightedGpa = totalWeightedGpa.add(summary.getGpaValue().multiply(credits));
                        totalWeightedGpa10 = totalWeightedGpa10.add(summary.getTotalScore().multiply(credits));
                        totalCreditsRegistered += credits.intValue();
                        if ("PASS".equals(summary.getResult())) {
                            totalCreditsEarned += credits.intValue();
                        }
                    }
                }
                courses.add(cg);
            }

            BigDecimal semGpa = semCredits > 0 && semWeightedGpa.compareTo(BigDecimal.ZERO) > 0
                    ? semWeightedGpa.divide(new BigDecimal(semCredits), 2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;

            semesterTranscripts.add(StudentTranscriptResponse.SemesterTranscript.builder()
                    .semesterId(semId)
                    .semesterCode(semCode)
                    .semesterName(semName)
                    .courses(courses)
                    .semesterGpa(semGpa)
                    .semesterCredits(semCredits)
                    .build());
        }

        BigDecimal cumGpa = totalCreditsRegistered > 0
                ? totalWeightedGpa.divide(new BigDecimal(totalCreditsRegistered), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        BigDecimal cumGpa10 = totalCreditsRegistered > 0
                ? totalWeightedGpa10.divide(new BigDecimal(totalCreditsRegistered), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        return StudentTranscriptResponse.builder()
                .studentId(studentId)
                .studentCode(student.getStudentCode())
                .studentName(student.getFullName())
                .semesters(semesterTranscripts)
                .cumulativeGpa(cumGpa)
                .cumulativeGpa10(cumGpa10)
                .totalCreditsRegistered(totalCreditsRegistered)
                .totalCreditsEarned(totalCreditsEarned)
                .build();
    }

    private GradeComponentResponse mapToComponentResponse(GradeComponent gc) {
        return GradeComponentResponse.builder()
                .id(gc.getId())
                .componentCode(gc.getComponentCode())
                .componentName(gc.getComponentName())
                .weightPercentage(gc.getWeightPercentage())
                .inputOrder(gc.getInputOrder())
                .note(gc.getNote())
                .build();
    }
}
