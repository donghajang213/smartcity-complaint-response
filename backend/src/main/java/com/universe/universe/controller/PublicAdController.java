package com.universe.universe.controller;

import com.universe.universe.dto.AdDTO;
import com.universe.universe.service.AdService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ads")          // ⭐ 관리자 prefix 없음 = 누구나 호출
@RequiredArgsConstructor
public class PublicAdController {

    private final AdService adService;

    /** 위치별 광고 리스트 (메인배너 등) */
    @GetMapping("/position")
    public List<AdDTO> getAdsByPosition(
            @RequestParam String position,                  // ← PathVariable 아님!
            @RequestParam(defaultValue = "3") int limit) {
        return adService.getAdsByPosition(position, limit);
    }

    /** 클릭 수 증가 (로그인 안 해도 가능) */
    @PostMapping("/click/{id}")
    public void incrementClick(@PathVariable Long id) {
        adService.incrementClick(id);
    }
}
