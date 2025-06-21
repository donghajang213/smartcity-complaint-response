package com.universe.universe.service;

import com.universe.universe.dto.AdDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface AdService {
    List<AdDTO> getAllAds();
    void toggleAds(boolean enabled);
    boolean isAdEnabled();
    void deleteAd(Long id);
    void reorderAds(List<AdDTO> reorderedList);
    void incrementClick(Long adId);
    List<AdDTO> getAdsByPosition(String position, int limit);
    void uploadAd(MultipartFile file, String linkUrl, String position) throws IOException;
}
