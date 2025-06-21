package com.universe.universe.controller;

import com.universe.universe.dto.*;
import com.universe.universe.service.DashboardService;
import com.universe.universe.service.ServerStatusService;
import com.universe.universe.service.StatsService;
import com.universe.universe.service.UserService;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final DashboardService dashboardService;
    private final StatsService statsService;
    private final ServerStatusService serverStatusService;
    private final UserService userService;
    private final MeterRegistry meterRegistry;

    public AdminController(DashboardService dashboardService,
                           StatsService statsService,
                           ServerStatusService serverStatusService,
                           UserService userService,
                           MeterRegistry meterRegistry) {
        this.dashboardService = dashboardService;
        this.statsService = statsService;
        this.serverStatusService = serverStatusService;
        this.userService = userService;
        this.meterRegistry = meterRegistry;
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
        ServerStatus status = serverStatusService.getServerStatus();

        // 기존 필드 유지
        Network originalNetwork = status.getNetwork();
        Connections originalConnections = status.getConnections();

        // 일부 값만 덮어쓰기 (나머지는 유지)
        double cpuUsage = meterRegistry.get("system.cpu.usage").gauge().value() * 100;
        double memoryUsed = meterRegistry.get("jvm.memory.used").gauge().value() / (1024 * 1024);
        double diskUsed = (new File("/").getTotalSpace() - new File("/").getUsableSpace()) / (1024 * 1024 * 1024.0);

        // 소수점 3자리로 반올림
        status.setCpuValue(Math.round(cpuUsage * 1000) / 1000.0);
        status.setMemValue(Math.round(memoryUsed * 1000) / 1000.0);
        status.setDiskValue(Math.round(diskUsed * 1000) / 1000.0);

        // 네트워크, 접속 정보 복원
        status.setNetwork(originalNetwork);
        status.setConnections(originalConnections);

        return status;
    }

}
