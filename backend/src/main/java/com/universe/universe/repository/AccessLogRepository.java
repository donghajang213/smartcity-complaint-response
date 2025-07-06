// src/main/java/com/universe/universe/repository/AccessLogRepository.java
package com.universe.universe.repository;

import com.universe.universe.dto.HourCount;
import com.universe.universe.entity.AccessLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AccessLogRepository extends JpaRepository<AccessLog, Long> {

    /**
     * 오늘 0시부터 현재까지, 시간(hour)별로 고유(user_id) 접속자를 집계
     */
    @Query(value = """
        SELECT
          date_part('hour', access_time)::int AS hour,
          COUNT(DISTINCT user_id)            AS count
        FROM access_log
        WHERE access_time >= date_trunc('day', now())
        GROUP BY date_part('hour', access_time)
        ORDER BY date_part('hour', access_time)
      """, nativeQuery = true)
    List<HourCount> fetchTodayAccessors();
}
