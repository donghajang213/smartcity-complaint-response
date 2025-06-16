package com.universe.universe.controller;

import com.universe.universe.dto.ChatRequest;
import com.universe.universe.dto.ChatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    @Value("${external.fastapi.url}")
    private String fastApiUrl; // 예: http://localhost:8001/chat

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping
    public ResponseEntity<?> chat(@RequestBody ChatRequest request) {
        try {
            // FastAPI 서버로 프록시 요청
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<ChatRequest> entity = new HttpEntity<>(request, headers);

            ResponseEntity<ChatResponse> response = restTemplate.postForEntity(fastApiUrl, entity, ChatResponse.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ChatResponse("FastAPI 서버 오류: " + e.getMessage()));
        }
    }
}
