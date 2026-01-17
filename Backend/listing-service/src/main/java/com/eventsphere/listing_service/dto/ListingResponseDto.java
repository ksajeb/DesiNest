package com.eventsphere.listing_service.dto;

import com.eventsphere.listing_service.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListingResponseDto {
    private Long id;
    private String title;
    private String description;
    private Long ownerUserId;
    private Double rent;
    private String city;
    private String landmark;
    private Category category;
    private List<String> images;
}
