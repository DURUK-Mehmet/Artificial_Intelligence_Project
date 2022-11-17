package com.marble.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.marble.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FavoritesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Favorites.class);
        Favorites favorites1 = new Favorites();
        favorites1.setId(1L);
        Favorites favorites2 = new Favorites();
        favorites2.setId(favorites1.getId());
        assertThat(favorites1).isEqualTo(favorites2);
        favorites2.setId(2L);
        assertThat(favorites1).isNotEqualTo(favorites2);
        favorites1.setId(null);
        assertThat(favorites1).isNotEqualTo(favorites2);
    }
}
