package com.universe.universe.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "uptime_stats")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UptimeStat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private double value;
}

