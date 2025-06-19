package com.universe.universe.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Network {
    private Long averageUsers;
    private Double avgResponseMs;
    private String status;
}