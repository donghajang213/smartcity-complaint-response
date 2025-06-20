package com.universe.universe.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
/**
 * 시간(hour)과 해당 시간대의 요청 수(count)를 나타내는 DTO
 */

public record TimeCount(int hour, long count) { }