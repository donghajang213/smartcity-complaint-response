package com.universe.universe.service.impl;

import com.universe.universe.dto.DashboardStats;
import com.universe.universe.repository.UserRepository;
import com.universe.universe.service.DashboardService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;

    public DashboardServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public DashboardStats getDashboardStats() {
        // 오늘 00:00 ~ 내일 00:00 범위 계산
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        LocalDateTime endOfToday   = startOfToday.plusDays(1);

        long totalUsers      = userRepository.count(); // 전체 사용자 수
        long todayVisitors   = userRepository.countByLastLoginAtBetween(startOfToday, endOfToday);
        long newRegistrations= userRepository.countByCreatedAtBetween(startOfToday, endOfToday);

        return new DashboardStats(totalUsers, todayVisitors, newRegistrations);
    }

    @Override
    public List<DateCount> getTotalUsersByDate() {
        return userRepository.countByDateGrouped();
    }
}
