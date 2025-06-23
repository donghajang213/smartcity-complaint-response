package com.universe.universe.service.impl;

import com.universe.universe.dto.AdDTO;
import com.universe.universe.entity.Ad;
import com.universe.universe.repository.AdRepository;
import com.universe.universe.service.AdService;
import org.springframework.util.StringUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdServiceImpl implements AdService {
    private final AdRepository adRepository;

    @Value("${ad.upload-dir}")
    private String uploadDir;

    @Value("${ad.base-url}")
    private String baseUrl;

    private boolean adEnabled = true;

    @Override
    public List<AdDTO> getAllAds() {
        return adRepository.findAllByOrderByOrderIndexAsc().stream()
                .map(ad -> new AdDTO(
                        ad.getId(),
                        ad.getImageUrl(),
                        ad.getLinkUrl(),
                        ad.getOrderIndex(),
                        ad.getClickCount(),
                        ad.getPosition()     // ✅ position 추가!
                ))
                .collect(Collectors.toList());
    }

    @Override
    public void toggleAds(boolean enabled) {
        this.adEnabled = enabled;
    }

    @Override
    public boolean isAdEnabled() {
        return adEnabled;
    }

    @Override
    public void uploadAd(MultipartFile file, String linkUrl, String position) throws IOException {
        // 1) uploadDir 을 절대경로 정규화
        Path uploadPath = Paths.get(uploadDir)
                .toAbsolutePath() // 절대경로 반환
                .normalize(); // ".."등을 정리

        // 2) 디렉터리 없으면 생성
        Files.createDirectories(uploadPath);

        // 3) 파일명 유니크하게 생성 (원본 파일명 sanitize 해도 좋습니다)
        String original = StringUtils.cleanPath(file.getOriginalFilename());
        String filename = System.currentTimeMillis() + "_" + original;

        // 4) 저장 대상 경로
        Path target = uploadPath.resolve(filename);

        // 5) 파일 저장
        file.transferTo(target.toFile());

        // 6) DB에 저장할 접근용 URL
        String accessUrl = baseUrl + "/" + filename;

        Ad ad = new Ad();
        ad.setImageUrl(accessUrl); // 절대 URL 저장
        ad.setLinkUrl(linkUrl);
        ad.setOrderIndex((int)adRepository.count());
        ad.setClickCount(0);
        ad.setPosition(position);
        adRepository.save(ad);
    }

    @Override
    public void deleteAd(Long id) {
        adRepository.deleteById(id);
    }

    @Override
    public void reorderAds(List<AdDTO> reorderedList) {
        for (AdDTO dto : reorderedList) {
            adRepository.findById(dto.getId()).ifPresent(ad -> {
                ad.setOrderIndex(dto.getOrderIndex());
                adRepository.save(ad);
            });
        }
    }

    @Override
    public void incrementClick(Long adId) {
        adRepository.findById(adId).ifPresent(ad -> {
            ad.setClickCount(ad.getClickCount() + 1);
            adRepository.save(ad);
        });
    }

    @Override
    public List<AdDTO> getAdsByPosition(String position, int limit) {
        return adRepository.findByPositionOrderByOrderIndexAsc(position).stream()
                .limit(limit)
                .map(ad -> new AdDTO(
                        ad.getId(), ad.getImageUrl(), ad.getLinkUrl(),
                        ad.getOrderIndex(), ad.getClickCount(), ad.getPosition()
                )).collect(Collectors.toList());
    }
}

