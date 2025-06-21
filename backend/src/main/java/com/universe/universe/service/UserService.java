package com.universe.universe.service;

import com.universe.universe.dto.SignupRequest;
import com.universe.universe.dto.User;

import java.util.List;

public interface UserService {
    void signup(SignupRequest request);

    List<User> getAllUsers();

//    User findByEmail(String email);
//
//    User registerGoogleUser(String email, String name, String phone);

//    List<User> getPendingAdmins();
//    void approveAdmin(Long id);
}

