package com.universe.universe.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.ZoneId;
import java.time.LocalDate;
import java.sql.Timestamp;

// DateCount.java
public interface DateCount {
    LocalDate getDate();
    Long      getCount();
}