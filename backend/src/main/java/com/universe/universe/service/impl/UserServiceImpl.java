package com.universe.universe.service.impl;

import com.universe.universe.dto.SignupRequest;
import com.universe.universe.entity.Role;
import com.universe.universe.entity.User;
import com.universe.universe.repository.UserRepository;
import com.universe.universe.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


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
//    @Override
//    public User findByEmail(String email) {
//        return userRepository.findByEmail(email).orElse(null);
//    }
//    @Override
//    public User registerGoogleUser(String email, String name, String phone) {
//        User user = new User();
//        user.setEmail(email);
//        user.setName(name);
//        user.setPhone(phone);  // phone이 없으면 null 넣어도 됨
//        return userRepository.save(user);
//    }





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

