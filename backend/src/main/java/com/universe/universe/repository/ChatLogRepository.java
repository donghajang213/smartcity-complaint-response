package com.universe.universe.repository;

import com.universe.universe.dto.CategoryStatDto;
import com.universe.universe.entity.ChatLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatLogRepository extends JpaRepository<ChatLog, Long> {
    @Query(value = """
            SELECT c.category_name, COUNT(c)
            FROM chat_log c
            GROUP BY c.category_name
            """, nativeQuery = true)
    List<CategoryStatDto> getCategoryStats();
}
