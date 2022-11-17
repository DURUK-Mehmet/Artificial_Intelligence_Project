package com.marble.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.marble.IntegrationTest;
import com.marble.domain.Marble;
import com.marble.repository.MarbleRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link MarbleResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MarbleResourceIT {

    private static final byte[] DEFAULT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMAGE_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_COLOUR = "AAAAAAAAAA";
    private static final String UPDATED_COLOUR = "BBBBBBBBBB";

    private static final String DEFAULT_PATTERN = "AAAAAAAAAA";
    private static final String UPDATED_PATTERN = "BBBBBBBBBB";

    private static final String DEFAULT_HOMOGENEOUS = "AAAAAAAAAA";
    private static final String UPDATED_HOMOGENEOUS = "BBBBBBBBBB";

    private static final String DEFAULT_VEIN = "AAAAAAAAAA";
    private static final String UPDATED_VEIN = "BBBBBBBBBB";

    private static final String DEFAULT_STRATIFICATION = "AAAAAAAAAA";
    private static final String UPDATED_STRATIFICATION = "BBBBBBBBBB";

    private static final String DEFAULT_CRACK = "AAAAAAAAAA";
    private static final String UPDATED_CRACK = "BBBBBBBBBB";

    private static final String DEFAULT_CRACK_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_CRACK_STATUS = "BBBBBBBBBB";

    private static final String DEFAULT_QUALITY = "AAAAAAAAAA";
    private static final String UPDATED_QUALITY = "BBBBBBBBBB";

    private static final String DEFAULT_PRICE = "AAAAAAAAAA";
    private static final String UPDATED_PRICE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/marbles";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MarbleRepository marbleRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMarbleMockMvc;

    private Marble marble;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Marble createEntity(EntityManager em) {
        Marble marble = new Marble()
            .image(DEFAULT_IMAGE)
            .imageContentType(DEFAULT_IMAGE_CONTENT_TYPE)
            .colour(DEFAULT_COLOUR)
            .pattern(DEFAULT_PATTERN)
            .homogeneous(DEFAULT_HOMOGENEOUS)
            .vein(DEFAULT_VEIN)
            .stratification(DEFAULT_STRATIFICATION)
            .crack(DEFAULT_CRACK)
            .crackStatus(DEFAULT_CRACK_STATUS)
            .quality(DEFAULT_QUALITY)
            .price(DEFAULT_PRICE);
        return marble;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Marble createUpdatedEntity(EntityManager em) {
        Marble marble = new Marble()
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE)
            .colour(UPDATED_COLOUR)
            .pattern(UPDATED_PATTERN)
            .homogeneous(UPDATED_HOMOGENEOUS)
            .vein(UPDATED_VEIN)
            .stratification(UPDATED_STRATIFICATION)
            .crack(UPDATED_CRACK)
            .crackStatus(UPDATED_CRACK_STATUS)
            .quality(UPDATED_QUALITY)
            .price(UPDATED_PRICE);
        return marble;
    }

    @BeforeEach
    public void initTest() {
        marble = createEntity(em);
    }

    @Test
    @Transactional
    void createMarble() throws Exception {
        int databaseSizeBeforeCreate = marbleRepository.findAll().size();
        // Create the Marble
        restMarbleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(marble)))
            .andExpect(status().isCreated());

        // Validate the Marble in the database
        List<Marble> marbleList = marbleRepository.findAll();
        assertThat(marbleList).hasSize(databaseSizeBeforeCreate + 1);
        Marble testMarble = marbleList.get(marbleList.size() - 1);
        assertThat(testMarble.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testMarble.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
        assertThat(testMarble.getColour()).isEqualTo(DEFAULT_COLOUR);
        assertThat(testMarble.getPattern()).isEqualTo(DEFAULT_PATTERN);
        assertThat(testMarble.getHomogeneous()).isEqualTo(DEFAULT_HOMOGENEOUS);
        assertThat(testMarble.getVein()).isEqualTo(DEFAULT_VEIN);
        assertThat(testMarble.getStratification()).isEqualTo(DEFAULT_STRATIFICATION);
        assertThat(testMarble.getCrack()).isEqualTo(DEFAULT_CRACK);
        assertThat(testMarble.getCrackStatus()).isEqualTo(DEFAULT_CRACK_STATUS);
        assertThat(testMarble.getQuality()).isEqualTo(DEFAULT_QUALITY);
        assertThat(testMarble.getPrice()).isEqualTo(DEFAULT_PRICE);
    }

    @Test
    @Transactional
    void createMarbleWithExistingId() throws Exception {
        // Create the Marble with an existing ID
        marble.setId(1L);

        int databaseSizeBeforeCreate = marbleRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMarbleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(marble)))
            .andExpect(status().isBadRequest());

        // Validate the Marble in the database
        List<Marble> marbleList = marbleRepository.findAll();
        assertThat(marbleList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMarbles() throws Exception {
        // Initialize the database
        marbleRepository.saveAndFlush(marble);

        // Get all the marbleList
        restMarbleMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(marble.getId().intValue())))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))))
            .andExpect(jsonPath("$.[*].colour").value(hasItem(DEFAULT_COLOUR)))
            .andExpect(jsonPath("$.[*].pattern").value(hasItem(DEFAULT_PATTERN)))
            .andExpect(jsonPath("$.[*].homogeneous").value(hasItem(DEFAULT_HOMOGENEOUS)))
            .andExpect(jsonPath("$.[*].vein").value(hasItem(DEFAULT_VEIN)))
            .andExpect(jsonPath("$.[*].stratification").value(hasItem(DEFAULT_STRATIFICATION)))
            .andExpect(jsonPath("$.[*].crack").value(hasItem(DEFAULT_CRACK)))
            .andExpect(jsonPath("$.[*].crackStatus").value(hasItem(DEFAULT_CRACK_STATUS)))
            .andExpect(jsonPath("$.[*].quality").value(hasItem(DEFAULT_QUALITY)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE)));
    }

    @Test
    @Transactional
    void getMarble() throws Exception {
        // Initialize the database
        marbleRepository.saveAndFlush(marble);

        // Get the marble
        restMarbleMockMvc
            .perform(get(ENTITY_API_URL_ID, marble.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(marble.getId().intValue()))
            .andExpect(jsonPath("$.imageContentType").value(DEFAULT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.image").value(Base64Utils.encodeToString(DEFAULT_IMAGE)))
            .andExpect(jsonPath("$.colour").value(DEFAULT_COLOUR))
            .andExpect(jsonPath("$.pattern").value(DEFAULT_PATTERN))
            .andExpect(jsonPath("$.homogeneous").value(DEFAULT_HOMOGENEOUS))
            .andExpect(jsonPath("$.vein").value(DEFAULT_VEIN))
            .andExpect(jsonPath("$.stratification").value(DEFAULT_STRATIFICATION))
            .andExpect(jsonPath("$.crack").value(DEFAULT_CRACK))
            .andExpect(jsonPath("$.crackStatus").value(DEFAULT_CRACK_STATUS))
            .andExpect(jsonPath("$.quality").value(DEFAULT_QUALITY))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE));
    }

    @Test
    @Transactional
    void getNonExistingMarble() throws Exception {
        // Get the marble
        restMarbleMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewMarble() throws Exception {
        // Initialize the database
        marbleRepository.saveAndFlush(marble);

        int databaseSizeBeforeUpdate = marbleRepository.findAll().size();

        // Update the marble
        Marble updatedMarble = marbleRepository.findById(marble.getId()).get();
        // Disconnect from session so that the updates on updatedMarble are not directly saved in db
        em.detach(updatedMarble);
        updatedMarble
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE)
            .colour(UPDATED_COLOUR)
            .pattern(UPDATED_PATTERN)
            .homogeneous(UPDATED_HOMOGENEOUS)
            .vein(UPDATED_VEIN)
            .stratification(UPDATED_STRATIFICATION)
            .crack(UPDATED_CRACK)
            .crackStatus(UPDATED_CRACK_STATUS)
            .quality(UPDATED_QUALITY)
            .price(UPDATED_PRICE);

        restMarbleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMarble.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMarble))
            )
            .andExpect(status().isOk());

        // Validate the Marble in the database
        List<Marble> marbleList = marbleRepository.findAll();
        assertThat(marbleList).hasSize(databaseSizeBeforeUpdate);
        Marble testMarble = marbleList.get(marbleList.size() - 1);
        assertThat(testMarble.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testMarble.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
        assertThat(testMarble.getColour()).isEqualTo(UPDATED_COLOUR);
        assertThat(testMarble.getPattern()).isEqualTo(UPDATED_PATTERN);
        assertThat(testMarble.getHomogeneous()).isEqualTo(UPDATED_HOMOGENEOUS);
        assertThat(testMarble.getVein()).isEqualTo(UPDATED_VEIN);
        assertThat(testMarble.getStratification()).isEqualTo(UPDATED_STRATIFICATION);
        assertThat(testMarble.getCrack()).isEqualTo(UPDATED_CRACK);
        assertThat(testMarble.getCrackStatus()).isEqualTo(UPDATED_CRACK_STATUS);
        assertThat(testMarble.getQuality()).isEqualTo(UPDATED_QUALITY);
        assertThat(testMarble.getPrice()).isEqualTo(UPDATED_PRICE);
    }

    @Test
    @Transactional
    void putNonExistingMarble() throws Exception {
        int databaseSizeBeforeUpdate = marbleRepository.findAll().size();
        marble.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMarbleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, marble.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(marble))
            )
            .andExpect(status().isBadRequest());

        // Validate the Marble in the database
        List<Marble> marbleList = marbleRepository.findAll();
        assertThat(marbleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMarble() throws Exception {
        int databaseSizeBeforeUpdate = marbleRepository.findAll().size();
        marble.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMarbleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(marble))
            )
            .andExpect(status().isBadRequest());

        // Validate the Marble in the database
        List<Marble> marbleList = marbleRepository.findAll();
        assertThat(marbleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMarble() throws Exception {
        int databaseSizeBeforeUpdate = marbleRepository.findAll().size();
        marble.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMarbleMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(marble)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Marble in the database
        List<Marble> marbleList = marbleRepository.findAll();
        assertThat(marbleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMarbleWithPatch() throws Exception {
        // Initialize the database
        marbleRepository.saveAndFlush(marble);

        int databaseSizeBeforeUpdate = marbleRepository.findAll().size();

        // Update the marble using partial update
        Marble partialUpdatedMarble = new Marble();
        partialUpdatedMarble.setId(marble.getId());

        partialUpdatedMarble
            .pattern(UPDATED_PATTERN)
            .homogeneous(UPDATED_HOMOGENEOUS)
            .stratification(UPDATED_STRATIFICATION)
            .price(UPDATED_PRICE);

        restMarbleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMarble.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMarble))
            )
            .andExpect(status().isOk());

        // Validate the Marble in the database
        List<Marble> marbleList = marbleRepository.findAll();
        assertThat(marbleList).hasSize(databaseSizeBeforeUpdate);
        Marble testMarble = marbleList.get(marbleList.size() - 1);
        assertThat(testMarble.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testMarble.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
        assertThat(testMarble.getColour()).isEqualTo(DEFAULT_COLOUR);
        assertThat(testMarble.getPattern()).isEqualTo(UPDATED_PATTERN);
        assertThat(testMarble.getHomogeneous()).isEqualTo(UPDATED_HOMOGENEOUS);
        assertThat(testMarble.getVein()).isEqualTo(DEFAULT_VEIN);
        assertThat(testMarble.getStratification()).isEqualTo(UPDATED_STRATIFICATION);
        assertThat(testMarble.getCrack()).isEqualTo(DEFAULT_CRACK);
        assertThat(testMarble.getCrackStatus()).isEqualTo(DEFAULT_CRACK_STATUS);
        assertThat(testMarble.getQuality()).isEqualTo(DEFAULT_QUALITY);
        assertThat(testMarble.getPrice()).isEqualTo(UPDATED_PRICE);
    }

    @Test
    @Transactional
    void fullUpdateMarbleWithPatch() throws Exception {
        // Initialize the database
        marbleRepository.saveAndFlush(marble);

        int databaseSizeBeforeUpdate = marbleRepository.findAll().size();

        // Update the marble using partial update
        Marble partialUpdatedMarble = new Marble();
        partialUpdatedMarble.setId(marble.getId());

        partialUpdatedMarble
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE)
            .colour(UPDATED_COLOUR)
            .pattern(UPDATED_PATTERN)
            .homogeneous(UPDATED_HOMOGENEOUS)
            .vein(UPDATED_VEIN)
            .stratification(UPDATED_STRATIFICATION)
            .crack(UPDATED_CRACK)
            .crackStatus(UPDATED_CRACK_STATUS)
            .quality(UPDATED_QUALITY)
            .price(UPDATED_PRICE);

        restMarbleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMarble.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMarble))
            )
            .andExpect(status().isOk());

        // Validate the Marble in the database
        List<Marble> marbleList = marbleRepository.findAll();
        assertThat(marbleList).hasSize(databaseSizeBeforeUpdate);
        Marble testMarble = marbleList.get(marbleList.size() - 1);
        assertThat(testMarble.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testMarble.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
        assertThat(testMarble.getColour()).isEqualTo(UPDATED_COLOUR);
        assertThat(testMarble.getPattern()).isEqualTo(UPDATED_PATTERN);
        assertThat(testMarble.getHomogeneous()).isEqualTo(UPDATED_HOMOGENEOUS);
        assertThat(testMarble.getVein()).isEqualTo(UPDATED_VEIN);
        assertThat(testMarble.getStratification()).isEqualTo(UPDATED_STRATIFICATION);
        assertThat(testMarble.getCrack()).isEqualTo(UPDATED_CRACK);
        assertThat(testMarble.getCrackStatus()).isEqualTo(UPDATED_CRACK_STATUS);
        assertThat(testMarble.getQuality()).isEqualTo(UPDATED_QUALITY);
        assertThat(testMarble.getPrice()).isEqualTo(UPDATED_PRICE);
    }

    @Test
    @Transactional
    void patchNonExistingMarble() throws Exception {
        int databaseSizeBeforeUpdate = marbleRepository.findAll().size();
        marble.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMarbleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, marble.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(marble))
            )
            .andExpect(status().isBadRequest());

        // Validate the Marble in the database
        List<Marble> marbleList = marbleRepository.findAll();
        assertThat(marbleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMarble() throws Exception {
        int databaseSizeBeforeUpdate = marbleRepository.findAll().size();
        marble.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMarbleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(marble))
            )
            .andExpect(status().isBadRequest());

        // Validate the Marble in the database
        List<Marble> marbleList = marbleRepository.findAll();
        assertThat(marbleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMarble() throws Exception {
        int databaseSizeBeforeUpdate = marbleRepository.findAll().size();
        marble.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMarbleMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(marble)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Marble in the database
        List<Marble> marbleList = marbleRepository.findAll();
        assertThat(marbleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMarble() throws Exception {
        // Initialize the database
        marbleRepository.saveAndFlush(marble);

        int databaseSizeBeforeDelete = marbleRepository.findAll().size();

        // Delete the marble
        restMarbleMockMvc
            .perform(delete(ENTITY_API_URL_ID, marble.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Marble> marbleList = marbleRepository.findAll();
        assertThat(marbleList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
