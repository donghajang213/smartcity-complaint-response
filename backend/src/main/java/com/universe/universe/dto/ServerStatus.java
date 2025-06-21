package com.universe.universe.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.universe.universe.dto.Network;
import com.universe.universe.dto.Connections;


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

    //  추가된 필드
    private Network network;
    private Connections connections;

    //  생성자에서 network를 넣지 않는다면, setter로 따로 설정 가능
    public ServerStatus(double cpuValue,
                        double memValue,
                        double diskValue,
                        double networkThroughput,
                        long connectionCount,
                        long totalNetworkStats,
                        long totalUptimeStats) {
        this.cpuValue = cpuValue;
        this.memValue = memValue;
        this.diskValue = diskValue;
        this.networkThroughput = networkThroughput;
        this.connectionCount = connectionCount;
        this.totalNetworkStats = totalNetworkStats;
        this.totalUptimeStats = totalUptimeStats;
    }
}