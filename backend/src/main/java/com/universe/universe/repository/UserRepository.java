package com.universe.universe.repository;

import com.universe.universe.dto.DateCount;
import com.universe.universe.dto.HourCount;
import com.universe.universe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    /**
     * 특정 기간 내 로그인한 사용자 수 (방문자 수)
     */
    long countByLastLoginAtBetween(LocalDateTime start, LocalDateTime end);

    /**
     * 특정 기간 내 신규 가입자 수
     */
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    /**
     * 전체 사용자 수를 날짜별로 그룹화하여 통계 조회
     */
    @Query("""
        SELECT
          function('DATE', u.createdAt) AS date,
          COUNT(u)                       AS count
        FROM User u
        GROUP BY function('DATE', u.createdAt)
        ORDER BY function('DATE', u.createdAt)
    """)
    List<DateCount> countByDateGrouped();
}