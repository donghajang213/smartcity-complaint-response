package com.universe.universe.service.impl;

import com.universe.universe.dto.HourCount;
import com.universe.universe.dto.StatusValue;
import com.universe.universe.dto.Throughput;
import com.universe.universe.repository.StatsRepository;
import com.universe.universe.repository.AccessLogRepository;
import com.universe.universe.service.StatsService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class StatsServiceImpl implements StatsService {
    private final StatsRepository statsRepository;
    private final AccessLogRepository accessLogRepository;

    public StatsServiceImpl(StatsRepository statsRepository,
                            AccessLogRepository accessLogRepository) {
        this.statsRepository = statsRepository;
        this.accessLogRepository = accessLogRepository;
    }


    @Override
    public List<DateCount> getNewRegistrations() {
        return statsRepository.fetchNewRegistrations();
    }

    @Override
    public List<HourCount> getTodayAccessors() {
        return accessLogRepository.fetchTodayAccessors();
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