package com.marble.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.marble.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SellerTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Seller.class);
        Seller seller1 = new Seller();
        seller1.setId(1L);
        Seller seller2 = new Seller();
        seller2.setId(seller1.getId());
        assertThat(seller1).isEqualTo(seller2);
        seller2.setId(2L);
        assertThat(seller1).isNotEqualTo(seller2);
        seller1.setId(null);
        assertThat(seller1).isNotEqualTo(seller2);
    }
}
