package com.universe.universe.controller;

import com.universe.universe.dto.AdDTO;
import com.universe.universe.service.AdService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/ads")
@RequiredArgsConstructor
public class AdController {

    private final AdService adService;

    @GetMapping
    public List<AdDTO> getAds() {
        return adService.getAllAds();
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadAd(
            @RequestParam("file") MultipartFile file,
            @RequestParam("linkUrl") String linkUrl,
            @RequestParam String position
    ) throws Exception {
        adService.uploadAd(file, linkUrl, position);
        return ResponseEntity.ok("업로드 완료");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAd(@PathVariable Long id) {
        adService.deleteAd(id);
        return ResponseEntity.ok("삭제 완료");
    }

    @PostMapping("/reorder")
    public ResponseEntity<?> reorderAds(@RequestBody List<AdDTO> ads) {
        adService.reorderAds(ads);
        return ResponseEntity.ok("순서 변경 완료");
    }

    @PostMapping("/toggle")
    public ResponseEntity<?> toggleAds(@RequestBody Map<String, Boolean> body) {
        adService.toggleAds(body.getOrDefault("enabled", true));
        return ResponseEntity.ok("상태 변경 완료");
    }

    @GetMapping("/status")
    public ResponseEntity<?> getAdStatus() {
        return ResponseEntity.ok(Map.of("enabled", adService.isAdEnabled()));
    }

    @PostMapping("/click/{id}")
    public ResponseEntity<?> incrementClick(@PathVariable Long id) {
        adService.incrementClick(id);
        return ResponseEntity.ok("클릭 증가");
    }

    @GetMapping("/position")
    public List<AdDTO> getAdsByPosition(
            @PathVariable String position,
            @RequestParam(defaultValue = "3") int limit) {
        return adService.getAdsByPosition(position, limit);
    }
}