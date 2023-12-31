package com.appbiomedicale.repository;

import com.appbiomedicale.domain.Capteur;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Capteur entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CapteurRepository extends JpaRepository<Capteur, Long> {}
