package com.universe.universe.service.impl;

import com.universe.universe.dto.ServerStatus;
import com.universe.universe.repository.ServerStatusRepository;
import com.universe.universe.service.ServerStatusService;
import org.springframework.stereotype.Service;

@Service
public class ServerStatusServiceImpl implements ServerStatusService {
    private final ServerStatusRepository repo;

    public ServerStatusServiceImpl(ServerStatusRepository repo) {
        this.repo = repo;
    }

    @Override
    public ServerStatus getServerStatus() {
        Long cpuId  = 1L;
        Long memId  = 2L;
        Long diskId = 3L;
        Long netId  = 4L;
        Long connId = 5L;
        return repo.fetchCurrentStatus(cpuId, memId, diskId, netId, connId);
    }
}
