package com.universe.universe.repository;

import com.universe.universe.dto.ServerStatus;
import com.universe.universe.entity.UptimeStat;
import com.universe.universe.entity.NetworkStat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ServerStatusRepository extends JpaRepository<UptimeStat, Long> {

    @Query("""
      SELECT new com.universe.universe.dto.ServerStatus(
        cpu.value,
        mem.value,
        disk.value,
        netStat.throughput,
        connStat.value,
        (SELECT COUNT(n) FROM NetworkStat n),
        (SELECT COUNT(u) FROM UptimeStat u)
      )
      FROM UptimeStat cpu,
           MemoryStat mem,
           DiskStat disk,
           NetworkStat netStat,
           ConnStat connStat
      WHERE cpu.id   = :cpuId
        AND mem.id   = :memId
        AND disk.id  = :diskId
        AND netStat.id = :netId
        AND connStat.id = :connId
    """)
    ServerStatus fetchCurrentStatus(
            @Param("cpuId")  Long cpuId,
            @Param("memId")  Long memId,
            @Param("diskId") Long diskId,
            @Param("netId")  Long netId,
            @Param("connId") Long connId
    );
}
