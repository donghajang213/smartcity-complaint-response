package com.universe.universe.service.impl;

import com.universe.universe.dto.ServerStatus;
import com.universe.universe.service.ServerStatusService;
import org.springframework.stereotype.Service;
import oshi.SystemInfo;
import oshi.hardware.CentralProcessor;
import oshi.hardware.GlobalMemory;
import oshi.software.os.FileSystem;
import oshi.software.os.OSFileStore;
import com.universe.universe.dto.Network;
import com.universe.universe.dto.Connections;


@Service
public class ServerStatusServiceImpl implements ServerStatusService {

    private final SystemInfo systemInfo = new SystemInfo();

    @Override
    public ServerStatus getServerStatus() {
        CentralProcessor processor = systemInfo.getHardware().getProcessor();
        GlobalMemory memory = systemInfo.getHardware().getMemory();
        FileSystem fileSystem = systemInfo.getOperatingSystem().getFileSystem();

        // ✅ CPU 사용률 (1초 측정)
        double cpuLoad = processor.getSystemCpuLoad(1000) * 100;

        // ✅ 메모리 사용률
        double memUsed = (memory.getTotal() - memory.getAvailable()) / (double) memory.getTotal() * 100;

        // ✅ 디스크 사용률 (첫 번째 디스크 기준)
        OSFileStore fileStore = fileSystem.getFileStores().get(0);
        double diskUsed = (fileStore.getTotalSpace() - fileStore.getUsableSpace()) / (double) fileStore.getTotalSpace() * 100;

        // ✅ 결과 DTO 세팅
        ServerStatus status = new ServerStatus();
        status.setCpuValue(Math.round(cpuLoad * 10) / 10.0);
        status.setMemValue(Math.round(memUsed * 10) / 10.0);
        status.setDiskValue(Math.round(diskUsed * 10) / 10.0);
        status.setNetworkThroughput(0); // 네트워크 처리량은 추후 구현
        status.setConnectionCount(0);   // 연결 수 추후 구현
        status.setTotalNetworkStats(0); // 통계형 정보 추후 구현
        status.setTotalUptimeStats(0);  // 업타임 통계 추후 구현

        // ✅ 네트워크 정보 추가
                status.setNetwork(new Network(
                        23,    // 평균 접속자 수
                        118,   // 평균 응답 시간
                        "정상" // 상태
                ));

        // ✅ 접속자 정보 추가
                status.setConnections(new Connections(
                        48,  // 총 접속자
                        12,  // 메인 서버
                        16,  // 프록시 서버
                        20   // DB 서버
                ));

        return status;
    }
}
