package com.universe.universe.service.impl;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class CaptchaServiceImpl {
    @Value("${recaptcha.secret}")
    private String secret;

    private static final String VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    public boolean verify(String token) {
        RestTemplate restTemplate = new RestTemplate();

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("secret", secret);
        params.add("response", token);

        RecaptchaResponse response = restTemplate.postForObject(VERIFY_URL, params, RecaptchaResponse.class);
        return response != null && response.isSuccess();
    }

    @Data
    public static class RecaptchaResponse {
        private boolean success;
        private String hostname;
        private String challenge_ts;
        private String[] errorCodes;
    }
}
