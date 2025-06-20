package com.universe.universe.service.impl;

import com.universe.universe.dto.DateCount;
import com.universe.universe.dto.HourCount;
import com.universe.universe.dto.StatusValue;
import com.universe.universe.dto.Throughput;
import com.universe.universe.repository.StatsRepository;
import com.universe.universe.repository.UserRepository;
import com.universe.universe.repository.AccessLogRepository;
import com.universe.universe.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class StatsServiceImpl implements StatsService {
    private final StatsRepository statsRepository;

    public StatsServiceImpl(StatsRepository statsRepository) {
        this.statsRepository = statsRepository;
    }

    @Override
    public List<DateCount> getNewRegistrations() {
        return statsRepository.fetchNewRegistrations();
    }

    @Override
    public List<HourCount> getTodayAccessors() {
        return statsRepository.fetchTodayAccessors();
    }

    @Override
    public List<Throughput> getServerNetworkHistory() {
        return statsRepository.fetchNetworkHistory();
    }

    @Override
    public List<StatusValue> getServerUptimeStats() {
        return statsRepository.fetchUptimeStats();
    }
}