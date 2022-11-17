package com.marble.repository;

import com.marble.domain.Favorites;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Favorites entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FavoritesRepository extends JpaRepository<Favorites, Long> {
    @Query("select favorites from Favorites favorites where favorites.user.login = ?#{principal.username}")
    List<Favorites> findByUserIsCurrentUser();
}
