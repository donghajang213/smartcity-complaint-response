package com.universe.universe.service;

import com.universe.universe.dto.DateCount;
import com.universe.universe.dto.HourCount;
import com.universe.universe.dto.StatusValue;
import com.universe.universe.dto.Throughput;

import java.util.List;

public interface StatsService {
    List<DateCount> getNewRegistrations();
    List<HourCount> getTodayAccessors();
    List<Throughput> getServerNetworkHistory();
    List<StatusValue> getServerUptimeStats();
}
