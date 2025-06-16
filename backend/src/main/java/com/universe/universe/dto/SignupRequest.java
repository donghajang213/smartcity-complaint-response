package com.universe.universe.dto;

import com.universe.universe.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignupRequest {
    @NotBlank
    private String name;
    @NotBlank
    @Email
    private String email;
    @NotNull
    private String password;
    private String phone;
    private Role role; // Enum
    private LocalDateTime createdAt;
}