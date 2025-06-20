 package com.universe.universe.config;


 import org.springframework.beans.factory.annotation.Value;
 import org.springframework.context.annotation.Configuration;
 import org.springframework.web.servlet.config.annotation.CorsRegistry;
 import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
 import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

 @Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${ad.upload-dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/ads/**")
//                .addResourceLocations("file:///" + uploadDir.replace("\\", "/") + "/");  // ← 로컬용
        .addResourceLocations("file:" + uploadDir + "/");
    }
     @Override
     public void addCorsMappings(CorsRegistry registry) {
         registry.addMapping("/**")
                 .allowedOrigins(
                         "http://localhost:5173",
                         "https://smartcityksva.site",
                         "https://www.smartcityksva.site",
                         "https://smartcity-rust.vercel.app"
                 )
                 .allowedMethods("GET","POST","PUT","DELETE","OPTIONS")
                 .allowedHeaders("*")
                 .exposedHeaders("Authorization")
                 .allowCredentials(true)
                 .maxAge(3600);
     }
}

