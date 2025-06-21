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

    // 오늘 가입(또는 로그인)한 사용자 수
    @Query("SELECT COUNT(u) FROM User u WHERE function('DATE', u.createdAt) = :date")
    long countByLastLoginDate(@Param("date") LocalDate date);

    // 전체 날짜별 가입자 수 통계
    @Query("""
        SELECT 
          function('DATE', u.createdAt) AS date,
          COUNT(u)                       AS count
        FROM User u
        GROUP BY function('DATE', u.createdAt)
        ORDER BY function('DATE', u.createdAt)
    """)
    List<DateCount> countByDateGrouped();

    // 특정 시점 이후 시간대별 가입(또는 로그인) 수 통계
    @Query("""
        SELECT
          function('HOUR', u.createdAt) AS hour,
          COUNT(u)                       AS count
        FROM User u
        WHERE u.createdAt >= :since
        GROUP BY function('HOUR', u.createdAt)
        ORDER BY function('HOUR', u.createdAt)
    """)
    List<HourCount> countByHourSince(@Param("since") LocalDateTime since);
}
