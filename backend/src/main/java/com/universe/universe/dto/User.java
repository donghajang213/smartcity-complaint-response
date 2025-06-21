package com.universe.universe.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class User {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private LocalDateTime createdAt;

    /** 엔티티 → DTO 변환 */
    public static User fromEntity(com.universe.universe.entity.User e) {
        User dto = new User();
        dto.setId(e.getUserId());
        dto.setName(e.getName());
        dto.setEmail(e.getEmail());
        dto.setPhone(e.getPhone());
        dto.setRole(e.getRole().name());
        dto.setCreatedAt(e.getCreatedAt());
        return dto;
    }
}