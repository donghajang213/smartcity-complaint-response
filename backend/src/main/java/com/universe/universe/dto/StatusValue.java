package com.universe.universe.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// 서버 업타임 비율
public interface StatusValue {
    String getStatus();
    Long   getValue();
}
