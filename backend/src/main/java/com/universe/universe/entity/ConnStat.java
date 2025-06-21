package com.universe.universe.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "conn_stats")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ConnStat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 현재 접속자 수 같은 필드 */
    @Column(nullable = false)
    private long value;
}
