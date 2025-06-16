package com.universe.universe.service;

import java.util.List;
import java.util.Map;

public interface PaymentService {
    // Webhook 처리 메서드 (스켈레톤)
    void processWebhook(Map<String, Object> payload);

    // userId로 대화 히스토리 조회 (스텁)
    List<Map<String, String>> getHistoryByUserId(String userId);
}

