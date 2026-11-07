package com.server.ACMIS.student.api;

import com.server.ACMIS.student.application.StudentService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/students")
public class StudentController {
    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('student:write')")
    public StudentDtos.Response create(@Valid @RequestBody StudentDtos.CreateRequest request) {
        return studentService.create(request);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('student:read')")
    public Page<StudentDtos.Response> search(@RequestParam(required = false) String query, Pageable pageable) {
        return studentService.search(query, pageable);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('student:write')")
    public StudentDtos.Response changeStatus(@PathVariable UUID id, @Valid @RequestBody StudentDtos.StatusRequest request) {
        return studentService.changeStatus(id, request.status());
    }
}
