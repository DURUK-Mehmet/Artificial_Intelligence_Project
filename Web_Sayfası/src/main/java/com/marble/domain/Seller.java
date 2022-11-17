package com.marble.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Seller.
 */
@Entity
@Table(name = "seller")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Seller implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "seller_name")
    private String sellerName;

    @Column(name = "company")
    private String company;

    @Column(name = "name")
    private String name;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "adress")
    private String adress;

    @Column(name = "telephone")
    private String telephone;

    @Column(name = "tax_number")
    private String taxNumber;

    @ManyToMany
    @JoinTable(
        name = "rel_seller__marbles",
        joinColumns = @JoinColumn(name = "seller_id"),
        inverseJoinColumns = @JoinColumn(name = "marbles_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "seller" }, allowSetters = true)
    private Set<Marble> marbles = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Seller id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSellerName() {
        return this.sellerName;
    }

    public Seller sellerName(String sellerName) {
        this.setSellerName(sellerName);
        return this;
    }

    public void setSellerName(String sellerName) {
        this.sellerName = sellerName;
    }

    public String getCompany() {
        return this.company;
    }

    public Seller company(String company) {
        this.setCompany(company);
        return this;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getName() {
        return this.name;
    }

    public Seller name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastName() {
        return this.lastName;
    }

    public Seller lastName(String lastName) {
        this.setLastName(lastName);
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getAdress() {
        return this.adress;
    }

    public Seller adress(String adress) {
        this.setAdress(adress);
        return this;
    }

    public void setAdress(String adress) {
        this.adress = adress;
    }

    public String getTelephone() {
        return this.telephone;
    }

    public Seller telephone(String telephone) {
        this.setTelephone(telephone);
        return this;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getTaxNumber() {
        return this.taxNumber;
    }

    public Seller taxNumber(String taxNumber) {
        this.setTaxNumber(taxNumber);
        return this;
    }

    public void setTaxNumber(String taxNumber) {
        this.taxNumber = taxNumber;
    }

    public Set<Marble> getMarbles() {
        return this.marbles;
    }

    public void setMarbles(Set<Marble> marbles) {
        this.marbles = marbles;
    }

    public Seller marbles(Set<Marble> marbles) {
        this.setMarbles(marbles);
        return this;
    }

    public Seller addMarbles(Marble marble) {
        this.marbles.add(marble);
        return this;
    }

    public Seller removeMarbles(Marble marble) {
        this.marbles.remove(marble);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Seller)) {
            return false;
        }
        return id != null && id.equals(((Seller) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Seller{" +
            "id=" + getId() +
            ", sellerName='" + getSellerName() + "'" +
            ", company='" + getCompany() + "'" +
            ", name='" + getName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", adress='" + getAdress() + "'" +
            ", telephone='" + getTelephone() + "'" +
            ", taxNumber='" + getTaxNumber() + "'" +
            "}";
    }
}
