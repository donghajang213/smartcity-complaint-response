package com.universe.universe.service.impl;

import com.universe.universe.dto.CategoryStatDto;
import com.universe.universe.repository.ChatLogRepository;
import com.universe.universe.service.ChatLogStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatLogStatsServiceImpl implements ChatLogStatsService {

    private final ChatLogRepository chatLogRepository;

    public List<CategoryStatDto> getCategoryStats() {
        return chatLogRepository.getCategoryStats();
    }
}

