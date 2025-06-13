package com.universe.universe.controller;

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

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@Valid @RequestBody SignupRequest request) {

        userService.signup(request);
        return ResponseEntity.ok(Map.of("message", "회원가입이 완료되었습니다."));
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtUtil.generateToken(request.getEmail());

        return ResponseEntity.ok(Map.of("token", token));
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
