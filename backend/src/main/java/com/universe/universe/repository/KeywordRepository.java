package com.universe.universe.repository;

import com.universe.universe.dto.KeywordStatDto;
import com.universe.universe.entity.Keyword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KeywordRepository extends JpaRepository<Keyword, Long> {

    // 전체 카테고리 기준 Top N 키워드 (예: 최근 30일 기준)
    @Query(value = """
        SELECT k.text AS text, SUM(k.count) AS count
        FROM keyword k
        JOIN chat_log c ON k.chat_log_id = c.id
        WHERE c.timestamp >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY k.text
        ORDER BY count DESC
        LIMIT 30
    """, nativeQuery = true)
    List<KeywordStatDto> getTopKeywordsForAllCategories();

    // 특정 카테고리 기준 Top N 키워드 (카테고리는 chatLog.categories로 조인)
    @Query(value = """
        SELECT k.text AS text, SUM(k.count) AS count
        FROM keyword k
        JOIN chat_log c ON k.chat_log_id = c.id
        JOIN chatlog_categories clc ON clc.chat_log_id = c.id
        JOIN category cat ON clc.category_id = cat.id
        WHERE c.timestamp >= CURRENT_DATE - INTERVAL '30 days'
          AND cat.name = :category
        GROUP BY k.text
        ORDER BY count DESC
        LIMIT 30
    """, nativeQuery = true)
    List<KeywordStatDto> getTopKeywordsByCategory(@Param("category") String category);
}
