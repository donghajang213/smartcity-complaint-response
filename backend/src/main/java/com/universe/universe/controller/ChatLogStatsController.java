package com.universe.universe.controller;

import com.universe.universe.dto.CategoryStatDto;
import com.universe.universe.dto.HourlyStatDto;
import com.universe.universe.service.ChatLogStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class ChatLogStatsController {

    private final ChatLogStatsService chatLogStatsService;

    @GetMapping("/category")
    public List<CategoryStatDto> getCategoryStats() {
        return chatLogStatsService.getCategoryStats();
    }

    @GetMapping("/hourly")
    public List<HourlyStatDto> getHourlyStats() { return chatLogStatsService.getHourlyStats(); }
}
