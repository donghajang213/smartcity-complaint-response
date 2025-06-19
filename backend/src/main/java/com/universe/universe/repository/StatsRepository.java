package com.universe.universe.repository;

import com.universe.universe.dto.DateCount;
import com.universe.universe.dto.HourCount;
import com.universe.universe.dto.Throughput;
import com.universe.universe.dto.StatusValue;
import com.universe.universe.entity.NetworkStat;
import com.universe.universe.entity.Registration;
import com.universe.universe.entity.UptimeStat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StatsRepository extends JpaRepository<Registration, Long> {

    // 날짜별 가입
    @Query("""
        SELECT
          function('DATE', r.registrationDate) AS date,
          COUNT(r)                             AS count
        FROM Registration r
        GROUP BY function('DATE', r.registrationDate)
        ORDER BY function('DATE', r.registrationDate)
    """)
    List<DateCount> fetchNewRegistrations();

    // 오늘 시간대별 접속자 수
    @Query("""
        SELECT
          function('HOUR', a.accessTime) AS hour,
          COUNT(a)                       AS count
        FROM AccessLog a
        WHERE function('DATE', a.accessTime) = CURRENT_DATE
        GROUP BY function('HOUR', a.accessTime)
        ORDER BY function('HOUR', a.accessTime)
    """)
    List<HourCount> fetchTodayAccessors();

    // 서버 네트워크 히스토리
    @Query("""
        SELECT
          s.timestamp   AS timestamp,
          s.throughput  AS throughput
        FROM NetworkStat s
    """)
    List<Throughput> fetchNetworkHistory();

    // 서버 업타임 통계
    @Query("""
        SELECT
          s.status AS status,
          s.value  AS value
        FROM UptimeStat s
    """)
    List<StatusValue> fetchUptimeStats();
}
