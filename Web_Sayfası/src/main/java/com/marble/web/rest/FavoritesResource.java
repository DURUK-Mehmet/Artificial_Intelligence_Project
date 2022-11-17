package com.marble.web.rest;

import com.marble.domain.Favorites;
import com.marble.repository.FavoritesRepository;
import com.marble.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.marble.domain.Favorites}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FavoritesResource {

    private final Logger log = LoggerFactory.getLogger(FavoritesResource.class);

    private static final String ENTITY_NAME = "favorites";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FavoritesRepository favoritesRepository;

    public FavoritesResource(FavoritesRepository favoritesRepository) {
        this.favoritesRepository = favoritesRepository;
    }

    /**
     * {@code POST  /favorites} : Create a new favorites.
     *
     * @param favorites the favorites to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new favorites, or with status {@code 400 (Bad Request)} if the favorites has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/favorites")
    public ResponseEntity<Favorites> createFavorites(@RequestBody Favorites favorites) throws URISyntaxException {
        log.debug("REST request to save Favorites : {}", favorites);
        if (favorites.getId() != null) {
            throw new BadRequestAlertException("A new favorites cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Favorites result = favoritesRepository.save(favorites);
        return ResponseEntity
            .created(new URI("/api/favorites/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /favorites/:id} : Updates an existing favorites.
     *
     * @param id the id of the favorites to save.
     * @param favorites the favorites to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated favorites,
     * or with status {@code 400 (Bad Request)} if the favorites is not valid,
     * or with status {@code 500 (Internal Server Error)} if the favorites couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/favorites/{id}")
    public ResponseEntity<Favorites> updateFavorites(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Favorites favorites
    ) throws URISyntaxException {
        log.debug("REST request to update Favorites : {}, {}", id, favorites);
        if (favorites.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, favorites.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!favoritesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Favorites result = favoritesRepository.save(favorites);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, favorites.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /favorites/:id} : Partial updates given fields of an existing favorites, field will ignore if it is null
     *
     * @param id the id of the favorites to save.
     * @param favorites the favorites to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated favorites,
     * or with status {@code 400 (Bad Request)} if the favorites is not valid,
     * or with status {@code 404 (Not Found)} if the favorites is not found,
     * or with status {@code 500 (Internal Server Error)} if the favorites couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/favorites/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Favorites> partialUpdateFavorites(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Favorites favorites
    ) throws URISyntaxException {
        log.debug("REST request to partial update Favorites partially : {}, {}", id, favorites);
        if (favorites.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, favorites.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!favoritesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Favorites> result = favoritesRepository
            .findById(favorites.getId())
            .map(existingFavorites -> {
                if (favorites.getUserName() != null) {
                    existingFavorites.setUserName(favorites.getUserName());
                }

                return existingFavorites;
            })
            .map(favoritesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, favorites.getId().toString())
        );
    }

    /**
     * {@code GET  /favorites} : get all the favorites.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of favorites in body.
     */
    @GetMapping("/favorites")
    public List<Favorites> getAllFavorites() {
        log.debug("REST request to get all Favorites");
        return favoritesRepository.findAll();
    }

    /**
     * {@code GET  /favorites/:id} : get the "id" favorites.
     *
     * @param id the id of the favorites to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the favorites, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/favorites/{id}")
    public ResponseEntity<Favorites> getFavorites(@PathVariable Long id) {
        log.debug("REST request to get Favorites : {}", id);
        Optional<Favorites> favorites = favoritesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(favorites);
    }

    /**
     * {@code DELETE  /favorites/:id} : delete the "id" favorites.
     *
     * @param id the id of the favorites to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/favorites/{id}")
    public ResponseEntity<Void> deleteFavorites(@PathVariable Long id) {
        log.debug("REST request to delete Favorites : {}", id);
        favoritesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
