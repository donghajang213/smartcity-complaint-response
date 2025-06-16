package com.universe.universe.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
    private String recaptcha; // 프론트에서 보내는 reCAPTCHA 토큰 필드 추가
}
