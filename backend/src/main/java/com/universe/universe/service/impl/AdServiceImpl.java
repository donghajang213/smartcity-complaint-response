package com.universe.universe.service.impl;

import com.universe.universe.dto.AdDTO;
import com.universe.universe.entity.Ad;
import com.universe.universe.repository.AdRepository;
import com.universe.universe.service.AdService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
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
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        File dest = new File(dir, filename);
        file.transferTo(dest);

        Ad ad = new Ad();
        ad.setImageUrl(baseUrl + "/" + filename); // 절대 URL 저장
        ad.setLinkUrl(linkUrl);
        ad.setOrderIndex(adRepository.findAll().size());
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

