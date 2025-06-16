package com.universe.universe.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    // ✅ Base64 인코딩된 비밀 키
    private final String SECRET_KEY = "r3zqA4fN9kbV8n9vml9qlU+9pGfGBNrx6F5EmAv7ZAk=";
    private final SecretKey key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(SECRET_KEY));

    // ✅ 토큰 유효 시간 (1시간)
    private final long EXPIRATION_TIME = 1000 * 60 * 60;

    // ✅ 토큰 생성
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ 토큰 유효성 검사 (JwtFilter용)
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // ✅ 토큰에서 이메일 추출
    public String validateTokenAndGetEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
