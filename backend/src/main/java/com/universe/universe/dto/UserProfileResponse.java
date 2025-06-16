package com.universe.universe.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserProfileResponse {
    private String name;
    private String email;
    private String phone;
    private String role;
}
