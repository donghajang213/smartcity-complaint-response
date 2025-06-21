package com.universe.universe.service.impl;

import com.universe.universe.dto.DashboardStats;
import com.universe.universe.dto.DateCount;
import com.universe.universe.repository.RegistrationRepository;
import com.universe.universe.repository.StatsRepository;
import com.universe.universe.repository.UserRepository;
import com.universe.universe.service.DashboardService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {
    private final UserRepository         userRepository;
    private final RegistrationRepository registrationRepository;

    public DashboardServiceImpl(UserRepository userRepository,
                                RegistrationRepository registrationRepository) {
        this.userRepository         = userRepository;
        this.registrationRepository = registrationRepository;
    }

    @Override
    public DashboardStats getDashboardStats() {
        long total   = userRepository.count();
        long today   = userRepository.countByLastLoginDate(LocalDate.now());
        long newRegs = registrationRepository.countByDate(LocalDate.now());
        return new DashboardStats(total, today, newRegs);
    }

    @Override
    public List<DateCount> getTotalUsersByDate() {
        return userRepository.countByDateGrouped();
    }
}


