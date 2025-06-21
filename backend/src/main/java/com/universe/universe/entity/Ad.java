package com.universe.universe.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Ad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imageUrl;
    private String linkUrl;
    private int orderIndex;
    private int clickCount;
    @Column(nullable = false)
    private String position;  // 위치 구분 (예: main-banner, chat-left 등)
}
