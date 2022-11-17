package com.marble.repository;

import com.marble.domain.Seller;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface SellerRepositoryWithBagRelationships {
    Optional<Seller> fetchBagRelationships(Optional<Seller> seller);

    List<Seller> fetchBagRelationships(List<Seller> sellers);

    Page<Seller> fetchBagRelationships(Page<Seller> sellers);
}
