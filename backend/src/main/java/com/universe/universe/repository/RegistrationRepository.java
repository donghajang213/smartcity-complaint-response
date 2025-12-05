package com.universe.universe.repository;

import com.universe.universe.dto.DateCount;
import com.universe.universe.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

import java.time.LocalDate;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    // 오늘 가입 건수
    @Query("SELECT COUNT(r) FROM Registration r WHERE function('DATE', r.registrationDate) = :date")
    long countByDate(@Param("date") LocalDate date);

    // 전체 날짜별 가입수 집계
    @Query("""
        SELECT
          function('DATE', r.registrationDate) AS date,
          COUNT(r)                             AS count
        FROM Registration r
        GROUP BY function('DATE', r.registrationDate)
        ORDER BY function('DATE', r.registrationDate)
    """)
    List<DateCount> findRegistrationsGroupedByDate();
}