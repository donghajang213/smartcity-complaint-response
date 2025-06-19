package com.universe.universe.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "memory_stats")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MemoryStat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 메모리 사용량(예: percentage) 같은 필드 */
    @Column(nullable = false)
    private double value;
}
