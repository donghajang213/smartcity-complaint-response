package com.universe.universe.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    private Map<String, Object> answer;
    // 에러 메시지를 answer 맵에 넣어 생성하는 생성자
    public ChatResponse(String errorMessage) {
        Map<String, Object> errorMap = new HashMap<>();
        errorMap.put("error", errorMessage);
        this.answer = errorMap;
    }
}
