package com.universe.universe.service.impl;

import com.universe.universe.dto.CategoryStatDto;
import com.universe.universe.dto.HourlyStatDto;
import com.universe.universe.repository.ChatLogRepository;
import com.universe.universe.service.ChatLogStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatLogStatsServiceImpl implements ChatLogStatsService {

    private final ChatLogRepository chatLogRepository;

    @Override
    public List<CategoryStatDto> getCategoryStats() {
        return chatLogRepository.getCategoryStats();
    }

    @Override
    public List<HourlyStatDto> getHourlyStats() {
        printHourlyRawDataWithTimestamp();
        return chatLogRepository.getHourlyStats();
    }

    public void printHourlyRawDataWithTimestamp() {
        List<Object[]> rawData = chatLogRepository.getHourlyRawDataWithTimestamp();

        for (Object[] row : rawData) {
            java.sql.Timestamp ts = (java.sql.Timestamp) row[0];
            Integer hour = ((Number) row[1]).intValue();
            Long count = ((Number) row[2]).longValue();

            System.out.println("timestamp=" + ts + ", hour=" + hour + ", count=" + count);
        }
    }
}

