package com.universe.universe.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignupRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private String mbti;
    private Long grade;
    private Long stdNum;
    private String department;
}