package com.universe.universe.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "disk_stats")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DiskStat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 디스크 사용량 필드 */
    @Column(nullable = false)
    private double value;
}
