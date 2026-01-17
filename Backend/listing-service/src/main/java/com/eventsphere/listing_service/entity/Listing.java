package com.eventsphere.listing_service.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "listings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Listing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "Give the title")
    private String title;

    @Column(nullable = false)
    @NotBlank(message = "Add some description about the listing")
    private String description;

    @Column(nullable = false)
    @NotNull
    private Long ownerUserId;

    @OneToMany(mappedBy = "listing", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ListingImage> images = new ArrayList<>();

    @Column(nullable = false)
    @NotNull
    private Double rent;

    @Column(nullable = false)
    @NotBlank(message = "City is required")
    private String city;

    @Column(nullable = false)
    @NotBlank(message = "Landmark is required")
    private String landmark;

    @Column(nullable = false)
    @NotNull(message = "Category is required")
    @Enumerated(EnumType.STRING)
    private Category category;


    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;;
}
