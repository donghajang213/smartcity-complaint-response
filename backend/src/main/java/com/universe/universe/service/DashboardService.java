package com.universe.universe.service;

import com.universe.universe.dto.DashboardStats;

import java.util.List;

public interface DashboardService {
    DashboardStats getDashboardStats();
    List<DateCount> getTotalUsersByDate();
}
