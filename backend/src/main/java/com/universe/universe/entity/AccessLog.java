package com.universe.universe.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "access_log")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccessLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime accessTime;

    // ← 추가
    @Column(name = "user_id", nullable = false)
    private Long userId;
}
