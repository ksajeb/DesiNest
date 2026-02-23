package com.eventsphere.booking_service.repository;

import com.eventsphere.booking_service.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    @Query("""
SELECT COUNT(b) > 0 FROM Booking b
WHERE b.listingId = :listingId
AND b.status IN ('PENDING','CONFIRMED')
AND (
    (:checkIn BETWEEN b.checkInDate AND b.checkOutDate)
    OR (:checkOut BETWEEN b.checkInDate AND b.checkOutDate)
    OR (b.checkInDate BETWEEN :checkIn AND :checkOut)
)
""")
    boolean existsOverlappingBooking(
            @Param("listingId") Long listingId,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut
    );

    List<Booking> findByUserId(Long userId);

    @Query("""
SELECT b.listingId FROM Booking b
WHERE b.checkInDate <= :endDate
AND b.checkOutDate >= :startDate
AND b.status = 'CONFIRMED'
""")
    List<Long> findBookedListingIds(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}