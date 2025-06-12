package com.universe.universe.repository;

import com.universe.universe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

//    List<User> findByRoleAndStatus(String admin, String pending);
}