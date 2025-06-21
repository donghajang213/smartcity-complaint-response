package com.universe.universe.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.universe.universe.dto.LoginRequest;
import com.universe.universe.dto.SignupRequest;
import com.universe.universe.dto.UserProfileResponse;
import com.universe.universe.entity.Role;
import com.universe.universe.entity.User;
import com.universe.universe.repository.UserRepository;
import com.universe.universe.security.JwtUtil;
import com.universe.universe.security.UserDetailsImpl;
import com.universe.universe.service.UserService;
import com.universe.universe.service.impl.CaptchaServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "https://smartcityksva.site",
                "https://www.smartcityksva.site"
        },
        allowCredentials = "true",
        allowedHeaders = "*",
        methods = {
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.OPTIONS
        }
)
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final CaptchaServiceImpl captchaService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /** application.yml 의 google.oauth2.client-id 를 주입받습니다. */
    @Value("${google.oauth2.client-id}")
    private String googleClientId;

    // [1] 회원가입
    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@Valid @RequestBody SignupRequest request) {
        userService.signup(request);
        return ResponseEntity.ok(Map.of("message", "회원가입이 완료되었습니다."));
    }

    // [2] 일반 로그인
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {
        if (!captchaService.verify(request.getRecaptcha())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "reCAPTCHA verification failed"));
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtUtil.generateToken(request.getEmail());
        return ResponseEntity.ok(Map.of("token", token));
    }

    // [3] 구글 로그인
    @PostMapping("/login/google")
    public ResponseEntity<Map<String, String>> loginWithGoogle(@RequestBody Map<String, String> body) throws Exception {
        String idTokenString = body.get("token");
        if (idTokenString == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token is missing"));
        }

        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JacksonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(googleClientId))
                .build();

        GoogleIdToken idToken = verifier.verify(idTokenString);
        if (idToken == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid ID token"));
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        String name  = (String) payload.get("name");
        String email = payload.getEmail();
        boolean emailVerified = Boolean.TRUE.equals(payload.getEmailVerified());

        if (!emailVerified) {
            return ResponseEntity.status(401).body(Map.of("error", "Email not verified by Google"));
        }

        Optional<User> optionalUser = userRepository.findByEmail(email);
        User user;
        if (optionalUser.isPresent()) {
            user = optionalUser.get();
        } else {
            user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            user.setRole(Role.FREE);
            user.setCreatedAt(LocalDateTime.now());
            userRepository.save(user);
        }

        String token = jwtUtil.generateToken(email);
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/login/kakao")
    public ResponseEntity<Map<String, String>> loginWithKakao(@RequestBody Map<String, String> body) throws Exception {
        String accessToken = body.get("token");
        if (accessToken == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token is missing"));
        }

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://kapi.kakao.com/v2/user/me"))
                .header("Authorization", "Bearer " + accessToken)
                .GET()
                .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> userData = objectMapper.readValue(response.body(), new TypeReference<>() {});
        Map<String, Object> kakaoAccount = (Map<String, Object>) userData.get("kakao_account");
        String email = kakaoAccount != null && kakaoAccount.get("email") != null
                ? kakaoAccount.get("email").toString()
                : "unknown@kakao.com";

        Optional<User> userOpt = userRepository.findByEmail(email);
        User user = userOpt.orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName("카카오 사용자");
            newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            newUser.setRole(Role.FREE);
            return userRepository.save(newUser);
        });

        String token = jwtUtil.generateToken(email);
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/login/naver")
    public ResponseEntity<?> loginWithNaver(@RequestBody Map<String, String> body) throws Exception {
        String accessToken = body.get("token");
        if (accessToken == null || accessToken.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "access_token 누락"));
        }

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://openapi.naver.com/v1/nid/me"))
                .header("Authorization", "Bearer " + accessToken)
                .GET()
                .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        JsonNode profile = new ObjectMapper()
                .readTree(response.body())
                .get("response");

        if (profile == null || profile.get("email") == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "사용자 정보 없음"));
        }

        String email = profile.get("email").asText();
        String name  = profile.has("name") ? profile.get("name").asText() : "네이버 사용자";

        Optional<User> userOpt = userRepository.findByEmail(email);
        User user = userOpt.orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            newUser.setRole(Role.FREE);
            return userRepository.save(newUser);
        });

        String jwt = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(Map.of("token", jwt));
    }

    // [4] 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // (필요시) 블랙리스트 로직
            return ResponseEntity.ok(Map.of("message", "로그아웃되었습니다."));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "유효하지 않은 토큰"));
    }

    @GetMapping("/user/profile")
    public ResponseEntity<UserProfileResponse> getProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userDetails.getUser();
        return ResponseEntity.ok(
                new UserProfileResponse(
                        user.getName(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getRole().name()
                )
        );
    }
}
