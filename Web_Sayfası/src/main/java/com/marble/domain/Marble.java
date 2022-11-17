package com.marble.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Marble.
 */
@Entity
@Table(name = "marble")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Marble implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Lob
    @Column(name = "image")
    private byte[] image;

    @Column(name = "image_content_type")
    private String imageContentType;

    @Column(name = "colour")
    private String colour;

    @Column(name = "pattern")
    private String pattern;

    @Column(name = "homogeneous")
    private String homogeneous;

    @Column(name = "vein")
    private String vein;

    @Column(name = "stratification")
    private String stratification;

    @Column(name = "crack")
    private String crack;

    @Column(name = "crack_status")
    private String crackStatus;

    @Column(name = "quality")
    private String quality;

    @Column(name = "price")
    private String price;

    @ManyToOne
    @JsonIgnoreProperties(value = { "marbles" }, allowSetters = true)
    private Seller seller;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Marble id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getImage() {
        return this.image;
    }

    public Marble image(byte[] image) {
        this.setImage(image);
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return this.imageContentType;
    }

    public Marble imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public String getColour() {
        return this.colour;
    }

    public Marble colour(String colour) {
        this.setColour(colour);
        return this;
    }

    public void setColour(String colour) {
        this.colour = colour;
    }

    public String getPattern() {
        return this.pattern;
    }

    public Marble pattern(String pattern) {
        this.setPattern(pattern);
        return this;
    }

    public void setPattern(String pattern) {
        this.pattern = pattern;
    }

    public String getHomogeneous() {
        return this.homogeneous;
    }

    public Marble homogeneous(String homogeneous) {
        this.setHomogeneous(homogeneous);
        return this;
    }

    public void setHomogeneous(String homogeneous) {
        this.homogeneous = homogeneous;
    }

    public String getVein() {
        return this.vein;
    }

    public Marble vein(String vein) {
        this.setVein(vein);
        return this;
    }

    public void setVein(String vein) {
        this.vein = vein;
    }

    public String getStratification() {
        return this.stratification;
    }

    public Marble stratification(String stratification) {
        this.setStratification(stratification);
        return this;
    }

    public void setStratification(String stratification) {
        this.stratification = stratification;
    }

    public String getCrack() {
        return this.crack;
    }

    public Marble crack(String crack) {
        this.setCrack(crack);
        return this;
    }

    public void setCrack(String crack) {
        this.crack = crack;
    }

    public String getCrackStatus() {
        return this.crackStatus;
    }

    public Marble crackStatus(String crackStatus) {
        this.setCrackStatus(crackStatus);
        return this;
    }

    public void setCrackStatus(String crackStatus) {
        this.crackStatus = crackStatus;
    }

    public String getQuality() {
        return this.quality;
    }

    public Marble quality(String quality) {
        this.setQuality(quality);
        return this;
    }

    public void setQuality(String quality) {
        this.quality = quality;
    }

    public String getPrice() {
        return this.price;
    }

    public Marble price(String price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public Seller getSeller() {
        return this.seller;
    }

    public void setSeller(Seller seller) {
        this.seller = seller;
    }

    public Marble seller(Seller seller) {
        this.setSeller(seller);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Marble)) {
            return false;
        }
        return id != null && id.equals(((Marble) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Marble{" +
            "id=" + getId() +
            ", image='" + getImage() + "'" +
            ", imageContentType='" + getImageContentType() + "'" +
            ", colour='" + getColour() + "'" +
            ", pattern='" + getPattern() + "'" +
            ", homogeneous='" + getHomogeneous() + "'" +
            ", vein='" + getVein() + "'" +
            ", stratification='" + getStratification() + "'" +
            ", crack='" + getCrack() + "'" +
            ", crackStatus='" + getCrackStatus() + "'" +
            ", quality='" + getQuality() + "'" +
            ", price='" + getPrice() + "'" +
            "}";
    }
}
