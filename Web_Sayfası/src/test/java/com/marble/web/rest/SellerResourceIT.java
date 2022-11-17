package com.marble.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.marble.IntegrationTest;
import com.marble.domain.Seller;
import com.marble.repository.SellerRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SellerResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class SellerResourceIT {

    private static final String DEFAULT_SELLER_NAME = "AAAAAAAAAA";
    private static final String UPDATED_SELLER_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_COMPANY = "AAAAAAAAAA";
    private static final String UPDATED_COMPANY = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ADRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADRESS = "BBBBBBBBBB";

    private static final String DEFAULT_TELEPHONE = "AAAAAAAAAA";
    private static final String UPDATED_TELEPHONE = "BBBBBBBBBB";

    private static final String DEFAULT_TAX_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_TAX_NUMBER = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/sellers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SellerRepository sellerRepository;

    @Mock
    private SellerRepository sellerRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSellerMockMvc;

    private Seller seller;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Seller createEntity(EntityManager em) {
        Seller seller = new Seller()
            .sellerName(DEFAULT_SELLER_NAME)
            .company(DEFAULT_COMPANY)
            .name(DEFAULT_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .adress(DEFAULT_ADRESS)
            .telephone(DEFAULT_TELEPHONE)
            .taxNumber(DEFAULT_TAX_NUMBER);
        return seller;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Seller createUpdatedEntity(EntityManager em) {
        Seller seller = new Seller()
            .sellerName(UPDATED_SELLER_NAME)
            .company(UPDATED_COMPANY)
            .name(UPDATED_NAME)
            .lastName(UPDATED_LAST_NAME)
            .adress(UPDATED_ADRESS)
            .telephone(UPDATED_TELEPHONE)
            .taxNumber(UPDATED_TAX_NUMBER);
        return seller;
    }

    @BeforeEach
    public void initTest() {
        seller = createEntity(em);
    }

    @Test
    @Transactional
    void createSeller() throws Exception {
        int databaseSizeBeforeCreate = sellerRepository.findAll().size();
        // Create the Seller
        restSellerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(seller)))
            .andExpect(status().isCreated());

        // Validate the Seller in the database
        List<Seller> sellerList = sellerRepository.findAll();
        assertThat(sellerList).hasSize(databaseSizeBeforeCreate + 1);
        Seller testSeller = sellerList.get(sellerList.size() - 1);
        assertThat(testSeller.getSellerName()).isEqualTo(DEFAULT_SELLER_NAME);
        assertThat(testSeller.getCompany()).isEqualTo(DEFAULT_COMPANY);
        assertThat(testSeller.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSeller.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testSeller.getAdress()).isEqualTo(DEFAULT_ADRESS);
        assertThat(testSeller.getTelephone()).isEqualTo(DEFAULT_TELEPHONE);
        assertThat(testSeller.getTaxNumber()).isEqualTo(DEFAULT_TAX_NUMBER);
    }

    @Test
    @Transactional
    void createSellerWithExistingId() throws Exception {
        // Create the Seller with an existing ID
        seller.setId(1L);

        int databaseSizeBeforeCreate = sellerRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSellerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(seller)))
            .andExpect(status().isBadRequest());

        // Validate the Seller in the database
        List<Seller> sellerList = sellerRepository.findAll();
        assertThat(sellerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSellers() throws Exception {
        // Initialize the database
        sellerRepository.saveAndFlush(seller);

        // Get all the sellerList
        restSellerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(seller.getId().intValue())))
            .andExpect(jsonPath("$.[*].sellerName").value(hasItem(DEFAULT_SELLER_NAME)))
            .andExpect(jsonPath("$.[*].company").value(hasItem(DEFAULT_COMPANY)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].adress").value(hasItem(DEFAULT_ADRESS)))
            .andExpect(jsonPath("$.[*].telephone").value(hasItem(DEFAULT_TELEPHONE)))
            .andExpect(jsonPath("$.[*].taxNumber").value(hasItem(DEFAULT_TAX_NUMBER)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllSellersWithEagerRelationshipsIsEnabled() throws Exception {
        when(sellerRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restSellerMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(sellerRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllSellersWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(sellerRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restSellerMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(sellerRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getSeller() throws Exception {
        // Initialize the database
        sellerRepository.saveAndFlush(seller);

        // Get the seller
        restSellerMockMvc
            .perform(get(ENTITY_API_URL_ID, seller.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(seller.getId().intValue()))
            .andExpect(jsonPath("$.sellerName").value(DEFAULT_SELLER_NAME))
            .andExpect(jsonPath("$.company").value(DEFAULT_COMPANY))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.adress").value(DEFAULT_ADRESS))
            .andExpect(jsonPath("$.telephone").value(DEFAULT_TELEPHONE))
            .andExpect(jsonPath("$.taxNumber").value(DEFAULT_TAX_NUMBER));
    }

    @Test
    @Transactional
    void getNonExistingSeller() throws Exception {
        // Get the seller
        restSellerMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSeller() throws Exception {
        // Initialize the database
        sellerRepository.saveAndFlush(seller);

        int databaseSizeBeforeUpdate = sellerRepository.findAll().size();

        // Update the seller
        Seller updatedSeller = sellerRepository.findById(seller.getId()).get();
        // Disconnect from session so that the updates on updatedSeller are not directly saved in db
        em.detach(updatedSeller);
        updatedSeller
            .sellerName(UPDATED_SELLER_NAME)
            .company(UPDATED_COMPANY)
            .name(UPDATED_NAME)
            .lastName(UPDATED_LAST_NAME)
            .adress(UPDATED_ADRESS)
            .telephone(UPDATED_TELEPHONE)
            .taxNumber(UPDATED_TAX_NUMBER);

        restSellerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSeller.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSeller))
            )
            .andExpect(status().isOk());

        // Validate the Seller in the database
        List<Seller> sellerList = sellerRepository.findAll();
        assertThat(sellerList).hasSize(databaseSizeBeforeUpdate);
        Seller testSeller = sellerList.get(sellerList.size() - 1);
        assertThat(testSeller.getSellerName()).isEqualTo(UPDATED_SELLER_NAME);
        assertThat(testSeller.getCompany()).isEqualTo(UPDATED_COMPANY);
        assertThat(testSeller.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSeller.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testSeller.getAdress()).isEqualTo(UPDATED_ADRESS);
        assertThat(testSeller.getTelephone()).isEqualTo(UPDATED_TELEPHONE);
        assertThat(testSeller.getTaxNumber()).isEqualTo(UPDATED_TAX_NUMBER);
    }

    @Test
    @Transactional
    void putNonExistingSeller() throws Exception {
        int databaseSizeBeforeUpdate = sellerRepository.findAll().size();
        seller.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSellerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, seller.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(seller))
            )
            .andExpect(status().isBadRequest());

        // Validate the Seller in the database
        List<Seller> sellerList = sellerRepository.findAll();
        assertThat(sellerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSeller() throws Exception {
        int databaseSizeBeforeUpdate = sellerRepository.findAll().size();
        seller.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSellerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(seller))
            )
            .andExpect(status().isBadRequest());

        // Validate the Seller in the database
        List<Seller> sellerList = sellerRepository.findAll();
        assertThat(sellerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSeller() throws Exception {
        int databaseSizeBeforeUpdate = sellerRepository.findAll().size();
        seller.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSellerMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(seller)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Seller in the database
        List<Seller> sellerList = sellerRepository.findAll();
        assertThat(sellerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSellerWithPatch() throws Exception {
        // Initialize the database
        sellerRepository.saveAndFlush(seller);

        int databaseSizeBeforeUpdate = sellerRepository.findAll().size();

        // Update the seller using partial update
        Seller partialUpdatedSeller = new Seller();
        partialUpdatedSeller.setId(seller.getId());

        partialUpdatedSeller.lastName(UPDATED_LAST_NAME);

        restSellerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSeller.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSeller))
            )
            .andExpect(status().isOk());

        // Validate the Seller in the database
        List<Seller> sellerList = sellerRepository.findAll();
        assertThat(sellerList).hasSize(databaseSizeBeforeUpdate);
        Seller testSeller = sellerList.get(sellerList.size() - 1);
        assertThat(testSeller.getSellerName()).isEqualTo(DEFAULT_SELLER_NAME);
        assertThat(testSeller.getCompany()).isEqualTo(DEFAULT_COMPANY);
        assertThat(testSeller.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSeller.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testSeller.getAdress()).isEqualTo(DEFAULT_ADRESS);
        assertThat(testSeller.getTelephone()).isEqualTo(DEFAULT_TELEPHONE);
        assertThat(testSeller.getTaxNumber()).isEqualTo(DEFAULT_TAX_NUMBER);
    }

    @Test
    @Transactional
    void fullUpdateSellerWithPatch() throws Exception {
        // Initialize the database
        sellerRepository.saveAndFlush(seller);

        int databaseSizeBeforeUpdate = sellerRepository.findAll().size();

        // Update the seller using partial update
        Seller partialUpdatedSeller = new Seller();
        partialUpdatedSeller.setId(seller.getId());

        partialUpdatedSeller
            .sellerName(UPDATED_SELLER_NAME)
            .company(UPDATED_COMPANY)
            .name(UPDATED_NAME)
            .lastName(UPDATED_LAST_NAME)
            .adress(UPDATED_ADRESS)
            .telephone(UPDATED_TELEPHONE)
            .taxNumber(UPDATED_TAX_NUMBER);

        restSellerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSeller.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSeller))
            )
            .andExpect(status().isOk());

        // Validate the Seller in the database
        List<Seller> sellerList = sellerRepository.findAll();
        assertThat(sellerList).hasSize(databaseSizeBeforeUpdate);
        Seller testSeller = sellerList.get(sellerList.size() - 1);
        assertThat(testSeller.getSellerName()).isEqualTo(UPDATED_SELLER_NAME);
        assertThat(testSeller.getCompany()).isEqualTo(UPDATED_COMPANY);
        assertThat(testSeller.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSeller.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testSeller.getAdress()).isEqualTo(UPDATED_ADRESS);
        assertThat(testSeller.getTelephone()).isEqualTo(UPDATED_TELEPHONE);
        assertThat(testSeller.getTaxNumber()).isEqualTo(UPDATED_TAX_NUMBER);
    }

    @Test
    @Transactional
    void patchNonExistingSeller() throws Exception {
        int databaseSizeBeforeUpdate = sellerRepository.findAll().size();
        seller.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSellerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, seller.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(seller))
            )
            .andExpect(status().isBadRequest());

        // Validate the Seller in the database
        List<Seller> sellerList = sellerRepository.findAll();
        assertThat(sellerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSeller() throws Exception {
        int databaseSizeBeforeUpdate = sellerRepository.findAll().size();
        seller.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSellerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(seller))
            )
            .andExpect(status().isBadRequest());

        // Validate the Seller in the database
        List<Seller> sellerList = sellerRepository.findAll();
        assertThat(sellerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSeller() throws Exception {
        int databaseSizeBeforeUpdate = sellerRepository.findAll().size();
        seller.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSellerMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(seller)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Seller in the database
        List<Seller> sellerList = sellerRepository.findAll();
        assertThat(sellerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSeller() throws Exception {
        // Initialize the database
        sellerRepository.saveAndFlush(seller);

        int databaseSizeBeforeDelete = sellerRepository.findAll().size();

        // Delete the seller
        restSellerMockMvc
            .perform(delete(ENTITY_API_URL_ID, seller.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Seller> sellerList = sellerRepository.findAll();
        assertThat(sellerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
