package com.universe.universe.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false)
    private String name;
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String phone;

    @Column(nullable = false)
    private String role = "USER";

    @Column(nullable = false)
    private String mbti;

    @Column(nullable = false)
    private Long grade;

    @Column(nullable = false)
    private Long stdNum;

    @Column(nullable = false)
    private String status = "PENDING";

    @Column(nullable = false)
    private String department;

    @Column(updatable = true)
    @CreationTimestamp
    private LocalDateTime createdAt;
}
