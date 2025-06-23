package com.universe.universe.config;

import com.universe.universe.security.JwtFilter;
import com.universe.universe.security.UserDetailsServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final UserDetailsServiceImpl userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CSRF 비활성화
                .csrf(csrf -> csrf.disable())

                // CORS 설정 제거 (모두 nginx에서 처리)
                // .cors(Customizer.withDefaults())

                // 세션 사용 안 함 (토큰 기반)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 인증 예외 처리
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, authEx) ->
                                res.sendError(HttpServletResponse.SC_UNAUTHORIZED, authEx.getMessage())
                        )
                )

                // 요청 권한 설정
                .authorizeHttpRequests(auth -> auth
                        // 프리플라이트 허용
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()

                        // 인증 없이 접근 가능한 API
                        .requestMatchers(
                                "/api/signup",
                                "/api/login",
                                "/api/auth/**",
                                "/api/chat/**",
                                "/api/stats/**"
                        ).permitAll()

                        // Swagger/OpenAPI
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**").permitAll()

                        // 광고 조회·클릭, 정적 리소스
                        .requestMatchers(org.springframework.http.HttpMethod.GET,  "/api/ads/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/ads/click/**").permitAll()
                        .requestMatchers("/static/ads/**").permitAll()

                        // 관리자 권한
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // 그 외는 인증 필요
                        .anyRequest().authenticated()
                )

                // UserDetailsService 설정
                .userDetailsService(userDetailsService)

                // 폼 로그인 비활성화
                .formLogin(form -> form.disable());

        // JWT 필터 등록
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
