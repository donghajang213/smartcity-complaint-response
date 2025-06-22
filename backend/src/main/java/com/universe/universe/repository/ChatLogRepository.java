package com.universe.universe.repository;

import com.universe.universe.dto.CategoryStatDto;
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
        GROUP BY cat.name
        ORDER BY count DESC
        """, nativeQuery = true)
    List<CategoryStatDto> getCategoryStats();
}
