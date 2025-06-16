package com.universe.universe.service;

import com.universe.universe.dto.SignupRequest;
import com.universe.universe.entity.User;
import org.springframework.web.client.RestTemplate;

import java.util.List;

public interface UserService {
    void signup(SignupRequest request);

    User findByEmail(String email);

    User registerGoogleUser(String email, String name, String phone);
<<<<<<< HEAD
//    User findByEmail(String email);
//
//    User registerGoogleUser(String email, String name, String phone);
=======
>>>>>>> parent of 5778eca ( guil backend)

//    List<User> getPendingAdmins();
//    void approveAdmin(Long id);
}

