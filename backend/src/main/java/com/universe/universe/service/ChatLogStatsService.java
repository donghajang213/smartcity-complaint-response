package com.universe.universe.service;

import com.universe.universe.dto.CategoryStatDto;
import com.universe.universe.dto.HourlyStatDto;
import com.universe.universe.repository.ChatLogRepository;

import java.util.List;

public interface ChatLogStatsService {
    List<CategoryStatDto> getCategoryStats();
    List<HourlyStatDto> getHourlyStats();
}
