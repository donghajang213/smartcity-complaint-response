 package com.universe.universe.config;


 import org.springframework.beans.factory.annotation.Value;
 import org.springframework.context.annotation.Configuration;
 import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
 import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

 @Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${ad.upload-dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/ads/**")
                .addResourceLocations("file:///" + uploadDir.replace("\\", "/") + "/");  // ← 핵심!
    }
}

