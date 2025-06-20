package com.universe.universe.controller;

import com.universe.universe.dto.*;
import com.universe.universe.service.DashboardService;
import com.universe.universe.service.ServerStatusService;
import com.universe.universe.service.StatsService;
import com.universe.universe.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final DashboardService dashboardService;
    private final StatsService statsService;
    private final ServerStatusService serverStatusService;
    private final UserService userService;

    public AdminController(DashboardService dashboardService,
                           StatsService statsService,
                           ServerStatusService serverStatusService,
                           UserService userService) {
        this.dashboardService = dashboardService;
        this.statsService = statsService;
        this.serverStatusService = serverStatusService;
        this.userService = userService;
    }

    @GetMapping("/dashboard/stats")
    public DashboardStats getDashboardStats() {
        return dashboardService.getDashboardStats();
    }

    @GetMapping("/dashboard/total-users")
    public List<DateCount> getTotalUsersByDate() {
        return dashboardService.getTotalUsersByDate();
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/stats/new-registrations")
    public List<DateCount> getNewRegistrations() {
        return statsService.getNewRegistrations();
    }

    @GetMapping("/stats/today-accessors")
    public List<HourCount> getTodayAccessors() {
        return statsService.getTodayAccessors();
    }

    @GetMapping("/stats/server-network")
    public List<Throughput> getServerNetworkHistory() {
        return statsService.getServerNetworkHistory();
    }

    @GetMapping("/stats/server-uptime")
    public List<StatusValue> getServerUptimeStats() {
        return statsService.getServerUptimeStats();
    }

    @GetMapping("/serverstatus")
    public ServerStatus getServerStatus() {
        return serverStatusService.getServerStatus();
    }
}
