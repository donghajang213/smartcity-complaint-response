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
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
    private final CaptchaServiceImpl captchaService; // 추가
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private static final String GOOGLE_CLIENT_ID = "360808269616-fr8sj0ddjvhejb6o9tjulbb11rr276ov.apps.googleusercontent.com";
    private JSONObject obj;


    // [1] 회원가입
    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@Valid @RequestBody SignupRequest request) {
        userService.signup(request);
        return ResponseEntity.ok(Map.of("message", "회원가입이 완료되었습니다."));
    }

    // [2] 일반 로그인
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {
        System.out.println("로그인 시도 email: " + request.getEmail());

        //  Step 1: reCAPTCHA 검증 먼저
        if (!captchaService.verify(request.getRecaptcha())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "reCAPTCHA verification failed"));
        }

        // Step 2: 로그인 인증 진행
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        System.out.println("authentication 성공? " + authentication.isAuthenticated());
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
                .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
                .build();

        GoogleIdToken idToken = verifier.verify(idTokenString);
        if (idToken == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid ID token"));
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        String name = (String) payload.get("name"); // Google 계정 이름
        String email = payload.getEmail();
        boolean emailVerified = Boolean.TRUE.equals(payload.getEmailVerified());

        if (!emailVerified) {
            return ResponseEntity.status(401).body(Map.of("error", "Email not verified by Google"));
        }

        //기존 유저 확인 또는 자동 가입
        Optional<User> optionalUser = userRepository.findByEmail(email);
        User user;

        if (optionalUser.isPresent()) {
            user = optionalUser.get();
            System.out.printf("기존 Google 사용자 로그인: " + email);
        } else {
            // 신규 Google 사용자 -> 자동 가입 처리
            user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString())); // 임시 비밀번호
            user.setRole(Role.FREE); // Enum 값으로 직접 설정
            user.setCreatedAt(LocalDateTime.now());
            userRepository.save(user);
            System.out.println("🎉 신규 Google 사용자 가입됨: " + email);
        }
        // JWT 발급
        String token = jwtUtil.generateToken(email);
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/login/kakao")
    public ResponseEntity<Map<String, String>> loginWithKakao(@RequestBody Map<String, String> body) throws Exception {
        String accessToken = body.get("token");
        if (accessToken == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token is missing"));
        }

        // Kakao 유저 정보 요청
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://kapi.kakao.com/v2/user/me"))
                .header("Authorization", "Bearer " + accessToken)
                .GET()
                .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        // ✅ JSON 파싱 (Jackson 사용)
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> userData = objectMapper.readValue(response.body(), new TypeReference<>() {});
        Map<String, Object> kakaoAccount = (Map<String, Object>) userData.get("kakao_account");

        // ✅ 이메일 추출
        String email = kakaoAccount != null && kakaoAccount.get("email") != null
                ? kakaoAccount.get("email").toString()
                : "unknown@kakao.com";

        // DB 조회 및 없으면 생성
        Optional<User> userOpt = userRepository.findByEmail(email);
        User user = userOpt.orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName("카카오 사용자");
            newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            newUser.setRole(Role.FREE);
            return userRepository.save(newUser);
        });

        // JWT 발급
        String token = jwtUtil.generateToken(email);
        return ResponseEntity.ok(Map.of("token", token));
    }


    @PostMapping("/login/naver")
    public ResponseEntity<?> loginWithNaver(@RequestBody Map<String, String> body) throws Exception {
        String accessToken = body.get("token");

        if (accessToken == null || accessToken.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "access_token 누락"));
        }

        // 사용자 정보 요청
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://openapi.naver.com/v1/nid/me"))
                .header("Authorization", "Bearer " + accessToken)
                .GET()
                .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        ObjectMapper mapper = new ObjectMapper();
        JsonNode profile = mapper.readTree(response.body()).get("response");

        if (profile == null || profile.get("email") == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "사용자 정보 없음"));
        }

        String email = profile.get("email").asText();
        String name = profile.has("name") ? profile.get("name").asText() : "네이버 사용자";

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




    // ✅ [4] 로그아웃 추가 (여기에 넣으면 됨!)
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            // 필요시: 블랙리스트 저장 로직 추가 가능
            return ResponseEntity.ok(Map.of("message", "로그아웃되었습니다."));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "유효하지 않은 토큰"));
    }


    @GetMapping("/user/profile")
    public ResponseEntity<UserProfileResponse> getProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
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

//    // ✅ 승인 대기중인 ADMIN 유저 조회 (관리자용)
//    @GetMapping("/admin/users/pending")
//    public ResponseEntity<List<User>> getPendingAdmins() {
//        List<User> pendingAdmins = userService.getPendingAdmins();
//        return ResponseEntity.ok(pendingAdmins);
//    }

    // ✅ ADMIN 승인 처리 (관리자용)
//    @PutMapping("/admin/users/{id}/approve")
//    public ResponseEntity<Map<String, String>> approveAdmin(@PathVariable Long id) {
//        userService.approveAdmin(id);
//        return ResponseEntity.ok(Map.of("message", "승인이 완료되었습니다."));
//    }

