package com.appbiomedicale.repository;

import com.appbiomedicale.domain.BoitierPatient;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the BoitierPatient entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BoitierPatientRepository extends JpaRepository<BoitierPatient, Long> {}
