package com.universe.universe.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AdDTO {
    private Long id;
    private String imageUrl;
    private String linkUrl;
    private int orderIndex;
    private int clickCount;
    private String position;
}