package com.universe.universe.service;

import com.universe.universe.dto.SignupRequest;
import com.universe.universe.entity.User;

import java.util.List;

public interface UserService {
    void signup(SignupRequest request);
//    List<User> getPendingAdmins();
//    void approveAdmin(Long id);
}

