package com.marble.web.rest;

import com.marble.domain.Marble;
import com.marble.repository.MarbleRepository;
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
 * REST controller for managing {@link com.marble.domain.Marble}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MarbleResource {

    private final Logger log = LoggerFactory.getLogger(MarbleResource.class);

    private static final String ENTITY_NAME = "marble";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MarbleRepository marbleRepository;

    public MarbleResource(MarbleRepository marbleRepository) {
        this.marbleRepository = marbleRepository;
    }

    /**
     * {@code POST  /marbles} : Create a new marble.
     *
     * @param marble the marble to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new marble, or with status {@code 400 (Bad Request)} if the marble has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/marbles")
    public ResponseEntity<Marble> createMarble(@RequestBody Marble marble) throws URISyntaxException {
        log.debug("REST request to save Marble : {}", marble);
        if (marble.getId() != null) {
            throw new BadRequestAlertException("A new marble cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Marble result = marbleRepository.save(marble);
        return ResponseEntity
            .created(new URI("/api/marbles/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /marbles/:id} : Updates an existing marble.
     *
     * @param id the id of the marble to save.
     * @param marble the marble to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated marble,
     * or with status {@code 400 (Bad Request)} if the marble is not valid,
     * or with status {@code 500 (Internal Server Error)} if the marble couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/marbles/{id}")
    public ResponseEntity<Marble> updateMarble(@PathVariable(value = "id", required = false) final Long id, @RequestBody Marble marble)
        throws URISyntaxException {
        log.debug("REST request to update Marble : {}, {}", id, marble);
        if (marble.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, marble.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!marbleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Marble result = marbleRepository.save(marble);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, marble.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /marbles/:id} : Partial updates given fields of an existing marble, field will ignore if it is null
     *
     * @param id the id of the marble to save.
     * @param marble the marble to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated marble,
     * or with status {@code 400 (Bad Request)} if the marble is not valid,
     * or with status {@code 404 (Not Found)} if the marble is not found,
     * or with status {@code 500 (Internal Server Error)} if the marble couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/marbles/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Marble> partialUpdateMarble(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Marble marble
    ) throws URISyntaxException {
        log.debug("REST request to partial update Marble partially : {}, {}", id, marble);
        if (marble.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, marble.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!marbleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Marble> result = marbleRepository
            .findById(marble.getId())
            .map(existingMarble -> {
                if (marble.getImage() != null) {
                    existingMarble.setImage(marble.getImage());
                }
                if (marble.getImageContentType() != null) {
                    existingMarble.setImageContentType(marble.getImageContentType());
                }
                if (marble.getColour() != null) {
                    existingMarble.setColour(marble.getColour());
                }
                if (marble.getPattern() != null) {
                    existingMarble.setPattern(marble.getPattern());
                }
                if (marble.getHomogeneous() != null) {
                    existingMarble.setHomogeneous(marble.getHomogeneous());
                }
                if (marble.getVein() != null) {
                    existingMarble.setVein(marble.getVein());
                }
                if (marble.getStratification() != null) {
                    existingMarble.setStratification(marble.getStratification());
                }
                if (marble.getCrack() != null) {
                    existingMarble.setCrack(marble.getCrack());
                }
                if (marble.getCrackStatus() != null) {
                    existingMarble.setCrackStatus(marble.getCrackStatus());
                }
                if (marble.getQuality() != null) {
                    existingMarble.setQuality(marble.getQuality());
                }
                if (marble.getPrice() != null) {
                    existingMarble.setPrice(marble.getPrice());
                }

                return existingMarble;
            })
            .map(marbleRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, marble.getId().toString())
        );
    }

    /**
     * {@code GET  /marbles} : get all the marbles.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of marbles in body.
     */
    @GetMapping("/marbles")
    public List<Marble> getAllMarbles() {
        log.debug("REST request to get all Marbles");
        return marbleRepository.findAll();
    }

    /**
     * {@code GET  /marbles/:id} : get the "id" marble.
     *
     * @param id the id of the marble to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the marble, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/marbles/{id}")
    public ResponseEntity<Marble> getMarble(@PathVariable Long id) {
        log.debug("REST request to get Marble : {}", id);
        Optional<Marble> marble = marbleRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(marble);
    }

    /**
     * {@code DELETE  /marbles/:id} : delete the "id" marble.
     *
     * @param id the id of the marble to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/marbles/{id}")
    public ResponseEntity<Void> deleteMarble(@PathVariable Long id) {
        log.debug("REST request to delete Marble : {}", id);
        marbleRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
