package com.eventsphere.listing_service.repository;

import com.eventsphere.listing_service.entity.Listing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ListingRepository extends JpaRepository<Listing,Long> {
}
