package com.universe.universe.controller;

import com.universe.universe.dto.ChatRequest;
import com.universe.universe.dto.ChatResponse;
import com.universe.universe.entity.Category;
import com.universe.universe.entity.ChatLog;
import com.universe.universe.entity.User;
import com.universe.universe.repository.CategoryRepository;
import com.universe.universe.repository.ChatLogRepository;
import com.universe.universe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    @Value("${external.fastapi.url}")
    private String fastApiUrl; // 예: http://localhost:8001/chat

    private final RestTemplate restTemplate = new RestTemplate();

    private final ChatLogRepository chatLogRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    @PostMapping
    public ResponseEntity<?> chat(@RequestBody ChatRequest request) {
        System.out.println("FastAPI URL: " + fastApiUrl);
        System.out.println("Request message: " + request.getMessage());
        try {
            // FastAPI 서버로 프록시 요청
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<ChatRequest> entity = new HttpEntity<>(request, headers);

            ResponseEntity<ChatResponse> response = restTemplate.postForEntity(fastApiUrl, entity, ChatResponse.class);
            ChatResponse chatResponse = response.getBody();

            if (chatResponse == null || chatResponse.getAnswer() == null) {
                return ResponseEntity.status(500).body(new ChatResponse("FastAPI 응답이 비어 있습니다."));
            }

            Map<String, Object> answerMap = chatResponse.getAnswer();

            // question, answer 추출
            String question = (String) answerMap.get("question");

            Map<String, Object> results = (Map<String, Object>) answerMap.get("results");
            String answer = (String) results.get("answer");

            Map<String, Object> apiResults = (Map<String, Object>) results.get("API_results");
            List<String> categories = Collections.emptyList();
            if (apiResults != null) {
                categories = (List<String>) apiResults.get("category");
            }

            // sources가 있고, 그 안에 content 또는 metadata가 존재할 경우만 저장
            List<Map<String, Object>> sources = (List<Map<String, Object>>) results.get("sources");
            boolean hasContentOrMetadata = sources != null && sources.stream().anyMatch(
                    source -> source.containsKey("content") || source.containsKey("metadata")
            );

            if (hasContentOrMetadata) {
                // JWT에서 로그인 유저 정보 가져오기
                Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
                String email;
                if (principal instanceof UserDetails) {
                    email = ((UserDetails) principal).getUsername();
                } else {
                    email = principal.toString();
                }

                // 이메일로 유저 조회 → userId 얻기
                User user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

                Set<Category> categorySet = new HashSet<>();
                if (categories != null) {
                    for (String categoryName : categories) {
                        Category category = categoryRepository.findByName(categoryName)
                                .orElseGet(() -> {
                                    Category newCat = new Category();
                                    newCat.setName(categoryName);
                                    return categoryRepository.save(newCat);
                                });
                        categorySet.add(category);
                    }
                }
                ChatLog chatLog = ChatLog.builder()
                        .user(user)
                        .question(question)
                        .answer(answer)
                        .timestamp(LocalDateTime.now(ZoneId.of("Asia/Seoul")))
                        .categories(categorySet)
                        .build();
                chatLogRepository.save(chatLog);
            }

            return ResponseEntity.ok(chatResponse);
        } catch (Exception e) {

            e.printStackTrace(); // 로그 추가

            return ResponseEntity.status(500)
                    .body(new ChatResponse("FastAPI 서버 오류: " + e.getMessage()));
        }
    }
}
