package com.universe.universe.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;
    private static final AntPathMatcher matcher = new AntPathMatcher();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String uri = request.getRequestURI();
        System.out.println("[JwtFilter] Request URI: " + uri);

        // Authorization 헤더 원본
        String header = request.getHeader("Authorization");
        System.out.println("[JwtFilter] Authorization header: " + header);

        // ✅ 인증 없이 통과시킬 URL 추가
        if (uri.equals("/api/signup")
                || uri.equals("/api/login")
                || uri.equals("/api/login/kakao")
                || uri.equals("/api/login/google")
                || uri.equals("/api/login/naver")
                || uri.startsWith("/v3/api-docs")
                || uri.startsWith("/swagger-ui")
                || uri.equals("/api/auth/refresh")) {
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ 정적 광고 파일은 토큰 검사 안 함
        if (matcher.match("/static/ads/**", uri)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = resolveToken(request);
        System.out.println("[JwtFilter] Resolved token: " + token);

        if (token != null) {
            if (jwtUtil.validateToken(token)) {
                String email = jwtUtil.validateTokenAndGetEmail(token);
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (bearer != null && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        return null;
    }
}
