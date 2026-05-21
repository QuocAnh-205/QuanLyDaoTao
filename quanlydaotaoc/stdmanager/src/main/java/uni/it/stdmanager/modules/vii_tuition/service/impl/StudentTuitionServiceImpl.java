package uni.it.stdmanager.modules.vii_tuition.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.modules.ii_student.entity.Student;
import uni.it.stdmanager.modules.ii_student.repository.StudentRepository;
import uni.it.stdmanager.modules.v_semester.entity.Semester;
import uni.it.stdmanager.modules.v_semester.repository.SemesterRepository;
import uni.it.stdmanager.modules.vi_registration.entity.CourseRegistration;
import uni.it.stdmanager.modules.vi_registration.repository.CourseRegistrationRepository;
import uni.it.stdmanager.modules.vii_tuition.dto.request.ManualTuitionRequest;
import uni.it.stdmanager.modules.vii_tuition.dto.request.StudentTuitionAdjustRequest;
import uni.it.stdmanager.modules.vii_tuition.dto.request.StudentTuitionSearchRequest;
import uni.it.stdmanager.modules.vii_tuition.dto.response.StudentTuitionResponse;
import uni.it.stdmanager.modules.vii_tuition.entity.StudentTuition;
import uni.it.stdmanager.modules.vii_tuition.entity.TuitionFee;
import uni.it.stdmanager.modules.vii_tuition.repository.StudentTuitionRepository;
import uni.it.stdmanager.modules.vii_tuition.repository.TuitionFeeRepository;
import uni.it.stdmanager.modules.vii_tuition.service.StudentTuitionService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentTuitionServiceImpl implements StudentTuitionService {

    private final StudentTuitionRepository studentTuitionRepository;
    private final StudentRepository studentRepository;
    private final SemesterRepository semesterRepository;
    private final TuitionFeeRepository tuitionFeeRepository;
    private final CourseRegistrationRepository courseRegistrationRepository;

    @Override
    public Page<StudentTuitionResponse> searchStudentTuitions(StudentTuitionSearchRequest request) {
        Sort sort = request.getSortDir().equalsIgnoreCase("asc")
                ? Sort.by(request.getSortBy()).ascending()
                : Sort.by(request.getSortBy()).descending();

        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), sort);
        Page<StudentTuition> tuitions = studentTuitionRepository.searchStudentTuitions(
                request.getSemesterId(),
                request.getClassId(),
                request.getStatus(),
                request.getKeyword(),
                pageable
        );
        return tuitions.map(this::mapToResponse);
    }

    @Override
    public StudentTuitionResponse getStudentTuitionById(UUID id) {
        StudentTuition tuition = studentTuitionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin học phí sinh viên"));
        return mapToResponse(tuition);
    }

    @Override
    public StudentTuitionResponse calculateTuition(UUID studentId, UUID semesterId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));
        Semester semester = semesterRepository.findById(semesterId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học kỳ"));

        // 1. Tìm đơn giá tín chỉ phù hợp
        BigDecimal pricePerCredit = BigDecimal.valueOf(500000); // Giá mặc định: 500,000 VND
        BigDecimal baseTuition = BigDecimal.ZERO;
        TuitionFee matchedFee = null;

        if (student.getProgram() != null && student.getAdmissionYear() != null) {
            String courseYear = "K" + (student.getAdmissionYear() % 100);
            matchedFee = tuitionFeeRepository.findFirstByProgramIdAndCourseYearAndIsActiveTrue(
                    student.getProgram().getId(), courseYear
            ).orElse(null);

            if (matchedFee != null) {
                pricePerCredit = matchedFee.getPricePerCredit();
                baseTuition = matchedFee.getBaseTuition();
            }
        }

        // 2. Tính tổng số tín chỉ đăng ký thành công
        List<CourseRegistration> registrations = courseRegistrationRepository
                .findAllByStudentIdAndCourseSectionSemesterId(studentId, semesterId);

        int totalCredits = 0;
        for (CourseRegistration reg : registrations) {
            if (Boolean.TRUE.equals(reg.getIsActive()) && (reg.getStatus() == 1 || reg.getStatus() == 2)) {
                if (reg.getCourseSection() != null && reg.getCourseSection().getCourse() != null) {
                    BigDecimal credits = reg.getCourseSection().getCourse().getCredits();
                    if (credits != null) {
                        totalCredits += credits.intValue();
                    }
                }
            }
        }

        // 3. Tìm hoặc khởi tạo bản ghi StudentTuition
        StudentTuition tuition = studentTuitionRepository
                .findByStudentIdAndSemesterIdAndIsActiveTrue(studentId, semesterId)
                .orElse(null);

        BigDecimal scholarshipDeduction = BigDecimal.ZERO;
        BigDecimal exemptionAmount = BigDecimal.ZERO;
        BigDecimal paidAmount = BigDecimal.ZERO;

        if (tuition != null) {
            scholarshipDeduction = tuition.getScholarshipDeduction() != null ? tuition.getScholarshipDeduction() : BigDecimal.ZERO;
            exemptionAmount = tuition.getExemptionAmount() != null ? tuition.getExemptionAmount() : BigDecimal.ZERO;
            paidAmount = tuition.getPaidAmount() != null ? tuition.getPaidAmount() : BigDecimal.ZERO;
        } else {
            tuition = new StudentTuition();
            tuition.setStudent(student);
            tuition.setSemester(semester);
            tuition.setScholarshipDeduction(BigDecimal.ZERO);
            tuition.setExemptionAmount(BigDecimal.ZERO);
            tuition.setPaidAmount(BigDecimal.ZERO);
            tuition.setDeadline(LocalDate.now().plusDays(30));
            tuition.setIsActive(true);
        }

        // 4. Tính toán số tiền
        BigDecimal rawAmount = pricePerCredit.multiply(BigDecimal.valueOf(totalCredits)).add(baseTuition);
        BigDecimal netAmount = rawAmount.subtract(scholarshipDeduction).subtract(exemptionAmount);
        if (netAmount.compareTo(BigDecimal.ZERO) < 0) {
            netAmount = BigDecimal.ZERO;
        }
        BigDecimal debtAmount = netAmount.subtract(paidAmount);

        int status = 3; // DEBT
        if (debtAmount.compareTo(BigDecimal.ZERO) <= 0) {
            debtAmount = BigDecimal.ZERO;
            status = 1; // PAID
        } else if (paidAmount.compareTo(BigDecimal.ZERO) > 0) {
            status = 2; // PARTIAL
        }

        // Kiểm tra quá hạn
        if (status != 1 && tuition.getDeadline() != null && LocalDate.now().isAfter(tuition.getDeadline())) {
            status = 4; // OVERDUE
        }

        tuition.setTuitionFee(matchedFee);
        tuition.setTotalCredits(totalCredits);
        tuition.setRawAmount(rawAmount);
        tuition.setNetAmount(netAmount);
        tuition.setDebtAmount(debtAmount);
        tuition.setStatus(status);

        tuition = studentTuitionRepository.save(tuition);
        return mapToResponse(tuition);
    }

    @Override
    public void calculateTuitionForAll(UUID semesterId) {
        List<UUID> studentIds = studentTuitionRepository.findStudentIdsWithRegistrations(semesterId);
        for (UUID studentId : studentIds) {
            try {
                calculateTuition(studentId, semesterId);
            } catch (Exception e) {
                // Log and continue to avoid breaking the batch processing
                System.err.println("Lỗi khi tính học phí cho sinh viên " + studentId + ": " + e.getMessage());
            }
        }
    }

    @Override
    public StudentTuitionResponse adjustTuition(UUID id, StudentTuitionAdjustRequest request) {
        StudentTuition tuition = studentTuitionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin học phí sinh viên"));

        BigDecimal scholarship = request.getScholarshipDeduction() != null ? request.getScholarshipDeduction() : BigDecimal.ZERO;
        BigDecimal exemption = request.getExemptionAmount() != null ? request.getExemptionAmount() : BigDecimal.ZERO;

        tuition.setScholarshipDeduction(scholarship);
        tuition.setExemptionAmount(exemption);

        // recalculate netAmount and debtAmount
        BigDecimal rawAmount = tuition.getRawAmount() != null ? tuition.getRawAmount() : BigDecimal.ZERO;
        BigDecimal netAmount = rawAmount.subtract(scholarship).subtract(exemption);
        if (netAmount.compareTo(BigDecimal.ZERO) < 0) {
            netAmount = BigDecimal.ZERO;
        }

        BigDecimal paidAmount = tuition.getPaidAmount() != null ? tuition.getPaidAmount() : BigDecimal.ZERO;
        BigDecimal debtAmount = netAmount.subtract(paidAmount);

        int status = 3; // DEBT
        if (debtAmount.compareTo(BigDecimal.ZERO) <= 0) {
            debtAmount = BigDecimal.ZERO;
            status = 1; // PAID
        } else if (paidAmount.compareTo(BigDecimal.ZERO) > 0) {
            status = 2; // PARTIAL
        }

        if (status != 1 && tuition.getDeadline() != null && LocalDate.now().isAfter(tuition.getDeadline())) {
            status = 4; // OVERDUE
        }

        tuition.setNetAmount(netAmount);
        tuition.setDebtAmount(debtAmount);
        tuition.setStatus(status);

        tuition = studentTuitionRepository.save(tuition);
        return mapToResponse(tuition);
    }

    @Override
    public StudentTuitionResponse createManualTuition(ManualTuitionRequest request) {
        // 1. Tìm sinh viên theo student_code
        Student student = studentRepository.findByStudentCode(request.getStudentCode())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên với mã: " + request.getStudentCode()));

        Semester semester = semesterRepository.findById(request.getSemesterId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học kỳ"));

        // 2. Kiểm tra đã tồn tại bản ghi chưa
        boolean exists = studentTuitionRepository
                .findByStudentIdAndSemesterIdAndIsActiveTrue(student.getId(), semester.getId())
                .isPresent();
        if (exists) {
            throw new RuntimeException("Sinh viên " + request.getStudentCode() + " đã có hồ sơ học phí học kỳ này!");
        }

        // 3. Xác định định mức học phí
        BigDecimal pricePerCredit = BigDecimal.valueOf(500000);
        BigDecimal baseTuition = BigDecimal.ZERO;
        TuitionFee matchedFee = null;

        if (student.getProgram() != null && student.getAdmissionYear() != null) {
            String courseYear = "K" + (student.getAdmissionYear() % 100);
            matchedFee = tuitionFeeRepository.findFirstByProgramIdAndCourseYearAndIsActiveTrue(
                    student.getProgram().getId(), courseYear).orElse(null);
            if (matchedFee != null) {
                pricePerCredit = matchedFee.getPricePerCredit();
                baseTuition = matchedFee.getBaseTuition();
            }
        }

        int credits = request.getTotalCredits() != null ? request.getTotalCredits() : 0;
        BigDecimal scholarship = request.getScholarshipDeduction() != null ? request.getScholarshipDeduction() : BigDecimal.ZERO;
        BigDecimal exemption = request.getExemptionAmount() != null ? request.getExemptionAmount() : BigDecimal.ZERO;
        BigDecimal paid = request.getPaidAmount() != null ? request.getPaidAmount() : BigDecimal.ZERO;

        // 4. Tính toán số tiền
        BigDecimal rawAmount = request.getRawAmount() != null
                ? request.getRawAmount()
                : pricePerCredit.multiply(BigDecimal.valueOf(credits)).add(baseTuition);

        BigDecimal netAmount = rawAmount.subtract(scholarship).subtract(exemption);
        if (netAmount.compareTo(BigDecimal.ZERO) < 0) netAmount = BigDecimal.ZERO;
        BigDecimal debtAmount = netAmount.subtract(paid);
        if (debtAmount.compareTo(BigDecimal.ZERO) < 0) debtAmount = BigDecimal.ZERO;

        int status = 3; // DEBT
        if (debtAmount.compareTo(BigDecimal.ZERO) <= 0) {
            status = 1; // PAID
        } else if (paid.compareTo(BigDecimal.ZERO) > 0) {
            status = 2; // PARTIAL
        }

        LocalDate deadline = request.getDeadline() != null ? request.getDeadline() : LocalDate.now().plusDays(60);
        if (status != 1 && deadline != null && LocalDate.now().isAfter(deadline)) {
            status = 4; // OVERDUE
        }

        // 5. Lưu bản ghi
        StudentTuition tuition = StudentTuition.builder()
                .student(student)
                .semester(semester)
                .tuitionFee(matchedFee)
                .totalCredits(credits)
                .rawAmount(rawAmount)
                .scholarshipDeduction(scholarship)
                .exemptionAmount(exemption)
                .netAmount(netAmount)
                .paidAmount(paid)
                .debtAmount(debtAmount)
                .status(status)
                .deadline(deadline)
                .build();
        tuition.setIsActive(true);
        tuition = studentTuitionRepository.save(tuition);
        return mapToResponse(tuition);
    }

    @Override
    public void deleteTuition(UUID id) {
        StudentTuition tuition = studentTuitionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ học phí"));
        tuition.setIsActive(false);
        studentTuitionRepository.save(tuition);
    }

    private StudentTuitionResponse mapToResponse(StudentTuition tuition) {
        String className = "Chưa xếp lớp";
        if (tuition.getStudent().getStudentClass() != null) {
            className = tuition.getStudent().getStudentClass().getClassName();
        }

        BigDecimal pricePerCredit = BigDecimal.valueOf(500000);
        BigDecimal baseTuition = BigDecimal.ZERO;
        if (tuition.getTuitionFee() != null) {
            pricePerCredit = tuition.getTuitionFee().getPricePerCredit();
            baseTuition = tuition.getTuitionFee().getBaseTuition();
        }

        return StudentTuitionResponse.builder()
                .id(tuition.getId())
                .studentId(tuition.getStudent().getId())
                .studentCode(tuition.getStudent().getStudentCode())
                .studentName(tuition.getStudent().getFullName())
                .className(className)
                .semesterId(tuition.getSemester().getId())
                .semesterName(tuition.getSemester().getSemesterName())
                .semesterCode(tuition.getSemester().getSemesterCode())
                .totalCredits(tuition.getTotalCredits())
                .rawAmount(tuition.getRawAmount())
                .scholarshipDeduction(tuition.getScholarshipDeduction())
                .exemptionAmount(tuition.getExemptionAmount())
                .netAmount(tuition.getNetAmount())
                .paidAmount(tuition.getPaidAmount())
                .debtAmount(tuition.getDebtAmount())
                .status(tuition.getStatus())
                .deadline(tuition.getDeadline())
                .pricePerCredit(pricePerCredit)
                .baseTuition(baseTuition)
                .build();
    }
}
