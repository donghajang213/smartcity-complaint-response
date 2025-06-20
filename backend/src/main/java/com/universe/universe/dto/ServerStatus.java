package com.universe.universe.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter @Setter @NoArgsConstructor
public class ServerStatus {
    private double cpuValue;
    private double memValue;
    private double diskValue;
    private double networkThroughput;
    private long connectionCount;
    private long totalNetworkStats;
    private long totalUptimeStats;

    public ServerStatus(double cpuValue,
                        double memValue,
                        double diskValue,
                        double networkThroughput,
                        long connectionCount,
                        long totalNetworkStats,
                        long totalUptimeStats) {
        this.cpuValue           = cpuValue;
        this.memValue           = memValue;
        this.diskValue          = diskValue;
        this.networkThroughput  = networkThroughput;
        this.connectionCount    = connectionCount;
        this.totalNetworkStats  = totalNetworkStats;
        this.totalUptimeStats   = totalUptimeStats;
    }
}