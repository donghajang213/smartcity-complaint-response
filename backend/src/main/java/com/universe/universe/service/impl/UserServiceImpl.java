package com.universe.universe.service.impl;

import com.universe.universe.dto.SignupRequest;
import com.universe.universe.dto.UserProfileResponse;
import com.universe.universe.entity.Role;
import com.universe.universe.entity.User;
import com.universe.universe.repository.UserRepository;
import com.universe.universe.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");


    @Override
    public void signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(encodedPassword)
                .phone(request.getPhone())
                .role(request.getRole() != null ? request.getRole() : Role.FREE)  // ✅ 기본값 처리
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);
    }

    @Override
    public List<UserProfileResponse> getAllUsers() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        return userRepository.findAll().stream()
                .map(user -> new UserProfileResponse(
                        user.getUserId(),
                        user.getName(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getRole() != null ? user.getRole().name() : null,
                        user.getCreatedAt() != null ? user.getCreatedAt().format(formatter) : null
                ))
                .collect(Collectors.toList());
    }





//    @Override
//    public List<User> getPendingAdmins() {
//        return userRepository.findByRoleAndStatus("ADMIN", "pending");
//    }

//    @Override
//    public void approveAdmin(Long id) {
//        User user = userRepository.findById(id)
//                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));
//        user.setStatus("allow");
//        userRepository.save(user);
//    }
}

