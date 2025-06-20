package com.universe.universe.config;

import com.universe.universe.security.JwtFilter;
import com.universe.universe.security.UserDetailsServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

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
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults()) // ✅ CorsConfigurationSource 사용
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 401 발생 시 Basic 챌린지가 아니라 그냥 401만 돌려주도록 설정
                .exceptionHandling(ex -> ex
                    .authenticationEntryPoint((req, res, authEx) -> {
                    res.sendError(HttpServletResponse.SC_UNAUTHORIZED, authEx.getMessage());
                })
               )
                .authorizeHttpRequests(auth -> auth
                        /* 1) CORS preflight */
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        /* 2) 회원가입·로그인 공개 */
                        .requestMatchers(
                                "/api/signup", "/api/signup/**",
                                "/api/login",  "/api/login/**",
                                "/api/auth/**", "api/chat","api/chat/**"
                        ).permitAll()

                        /* 3) API 문서 */
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**").permitAll()

                        /* 4) 광고 ― 누구나 접근 가능 ----------------------- */
                        .requestMatchers(HttpMethod.GET,  "/api/ads/**").permitAll()      // 위치별 조회
                        .requestMatchers(HttpMethod.POST, "/api/ads/click/**").permitAll()// 클릭 증가
                        .requestMatchers(HttpMethod.GET, "/static/ads/**").permitAll()
                        /* 5) 관리자 영역 ― 보호 ---------------------------- */
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        /* 6) 나머지는 인증 필요 --------------------------- */
                        .anyRequest().authenticated()
                )

                .userDetailsService(userDetailsService)
                .formLogin(form -> form.disable());
//                .httpBasic(Customizer.withDefaults());

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

    // ✅ CORS 설정은 여기서 통합
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of(
                "http://localhost:5173",                     // 로컬 개발
                "https://smartcityksva.site",                // 운영 도메인 (naked)
                "https://www.smartcityksva.site",            // 운영 도메인 (www)
                "https://smartcity-rust.vercel.app"          // Vercel 배포
        ));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // 쿠키·헤더 포함 허용
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
