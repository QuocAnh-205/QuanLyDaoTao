// 1. StudentService.java
package uni.it.stdmanager.modules.ii_student.service;

import org.springframework.data.domain.Page;
import uni.it.stdmanager.modules.ii_student.dto.request.StudentCreationRequest;
import uni.it.stdmanager.modules.ii_student.dto.request.StudentSearchRequest;
import uni.it.stdmanager.modules.ii_student.dto.request.StudentStatusChangeRequest;
import uni.it.stdmanager.modules.ii_student.dto.request.StudentUpdateRequest;
import uni.it.stdmanager.modules.ii_student.dto.response.StudentResponse;
import uni.it.stdmanager.modules.ii_student.dto.response.StudentStatusResponse;

import java.util.List;
import java.util.UUID;

public interface StudentService {
    Page<StudentResponse> searchStudents(StudentSearchRequest request);

    StudentResponse getStudentById(UUID id);

    StudentResponse createStudent(StudentCreationRequest request);

    StudentResponse updateStudent(UUID id, StudentUpdateRequest request);

    StudentResponse changeStatus(UUID id, StudentStatusChangeRequest request);

    List<StudentStatusResponse> getStatusHistory(UUID id);
}