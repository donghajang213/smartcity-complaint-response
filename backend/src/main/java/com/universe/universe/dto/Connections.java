package com.universe.universe.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Connections {
    private Double current;
    private String main;
    private String proxy;
    private String db;
}