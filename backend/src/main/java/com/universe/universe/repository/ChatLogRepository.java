package com.universe.universe.repository;

import com.universe.universe.dto.CategoryStatDto;
import com.universe.universe.dto.HourlyStatDto;
import com.universe.universe.entity.ChatLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatLogRepository extends JpaRepository<ChatLog, Long> {
    @Query(value = """
        SELECT cat.name AS categoryName, COUNT(cl.id) AS count
        FROM chatlog_categories cc
        JOIN category cat ON cc.category_id = cat.id
        JOIN chat_log cl ON cc.chat_log_id = cl.id
        WHERE cl.timestamp >= NOW() - INTERVAL '1 month'
        GROUP BY cat.name
        ORDER BY count DESC
        """, nativeQuery = true)
    List<CategoryStatDto> getCategoryStats();

    @Query(value = """
        SELECT
          hours.hour AS hour,
          COALESCE(counts.count, 0) AS count
        FROM
          generate_series(0, 23) AS hours(hour)
        LEFT JOIN (
          SELECT
            EXTRACT(HOUR FROM timestamp) AS hour,
            COUNT(*) AS count
          FROM
            chat_log
          WHERE
            timestamp >= NOW() - INTERVAL '24 hours'
          GROUP BY
            EXTRACT(HOUR FROM timestamp)
        ) AS counts
        ON hours.hour = counts.hour
        ORDER BY
          hours.hour;
        """, nativeQuery = true)
    List<HourlyStatDto> getHourlyStats();
}
