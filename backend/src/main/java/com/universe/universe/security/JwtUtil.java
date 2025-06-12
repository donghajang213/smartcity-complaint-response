package com.universe.universe.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    // ✅ 1. Base64 인코딩된 안전한 비밀 키 사용
    private final String SECRET_KEY = "r3zqA4fN9kbV8n9vml9qlU+9pGfGBNrx6F5EmAv7ZAk="; // 예시값, 교체 가능
    private final SecretKey key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(SECRET_KEY));

    // ✅ 2. 토큰 만료 시간 (1시간)
    private final long EXPIRATION_TIME = 1000 * 60 * 60;

    // ✅ 3. 토큰 생성
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256) // ✅ 최신 형식
                .compact();
    }

    // ✅ 4. 토큰 검증 및 이메일 추출
    public String validateTokenAndGetEmail(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
