package com.universe.universe.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.universe.universe.dto.LoginRequest;
import com.universe.universe.dto.SignupRequest;
import com.universe.universe.dto.UserProfileResponse;
import com.universe.universe.entity.User;
import com.universe.universe.security.JwtUtil;
import com.universe.universe.security.UserDetailsImpl;
import com.universe.universe.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

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
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        System.out.println("authentication 성공? " + authentication.isAuthenticated());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtUtil.generateToken(request.getEmail());

        return ResponseEntity.ok(Map.of("token", token));
    }

    // [3] 구글 로그인
    private static final String GOOGLE_CLIENT_ID = "360808269616-fr8sj0ddjvhejb6o9tjulbb11rr276ov.apps.googleusercontent.com";

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

        String email = payload.getEmail();
        boolean emailVerified = Boolean.TRUE.equals(payload.getEmailVerified());

        if (!emailVerified) {
            return ResponseEntity.status(401).body(Map.of("error", "Email not verified by Google"));
        }

        String token = jwtUtil.generateToken(email);
        return ResponseEntity.ok(Map.of("token", token));
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

