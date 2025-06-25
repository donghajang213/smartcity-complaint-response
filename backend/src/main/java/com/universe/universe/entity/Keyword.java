package com.universe.universe.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Keyword {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;

    @Column(nullable = false)
    private int count;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_log_id")
    private ChatLog chatLog;
}

