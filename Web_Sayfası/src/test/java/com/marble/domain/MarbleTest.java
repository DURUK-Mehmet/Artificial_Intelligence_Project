package com.marble.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.marble.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MarbleTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Marble.class);
        Marble marble1 = new Marble();
        marble1.setId(1L);
        Marble marble2 = new Marble();
        marble2.setId(marble1.getId());
        assertThat(marble1).isEqualTo(marble2);
        marble2.setId(2L);
        assertThat(marble1).isNotEqualTo(marble2);
        marble1.setId(null);
        assertThat(marble1).isNotEqualTo(marble2);
    }
}
