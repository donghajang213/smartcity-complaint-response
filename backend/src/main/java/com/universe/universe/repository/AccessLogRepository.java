package com.universe.universe.repository;

import com.universe.universe.dto.TimeCount;
import com.universe.universe.entity.AccessLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AccessLogRepository extends JpaRepository<AccessLog, Long> {

    @Query("""
      SELECT new com.universe.universe.dto.TimeCount(
        HOUR(a.accessTime),
        COUNT(DISTINCT a.userId)
      )
      FROM AccessLog a
      WHERE a.accessTime >= :startOfDay
      GROUP BY HOUR(a.accessTime)
      ORDER BY HOUR(a.accessTime)
    """)
    List<TimeCount> countByHourSince(@Param("startOfDay") LocalDateTime startOfDay);
}


