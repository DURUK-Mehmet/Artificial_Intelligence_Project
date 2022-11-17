package com.marble.repository;

import com.marble.domain.Marble;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Marble entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MarbleRepository extends JpaRepository<Marble, Long> {}
