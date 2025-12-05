package com.universe.universe.service.impl;

import com.universe.universe.dto.CategoryStatDto;
import com.universe.universe.dto.HourlyStatDto;
import com.universe.universe.dto.KeywordStatDto;
import com.universe.universe.repository.ChatLogRepository;
import com.universe.universe.repository.KeywordRepository;
import com.universe.universe.service.ChatLogStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatLogStatsServiceImpl implements ChatLogStatsService {

    private final ChatLogRepository chatLogRepository;
    private final KeywordRepository keywordRepository;

    @Override
    public List<CategoryStatDto> getCategoryStats() {
        return chatLogRepository.getCategoryStats();
    }

    @Override
    public List<HourlyStatDto> getHourlyStats() {
        return chatLogRepository.getHourlyStats();
    }

    @Override
    public List<KeywordStatDto> getKeywordStatsByCategory(String category) {
        if (category == null || category.isBlank()) {
            return keywordRepository.getTopKeywordsForAllCategories();
        } else {
            return keywordRepository.getTopKeywordsByCategory(category);
        }
    }
}

