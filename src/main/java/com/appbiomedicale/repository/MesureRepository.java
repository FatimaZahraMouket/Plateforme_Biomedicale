package com.appbiomedicale.repository;

import com.appbiomedicale.domain.Mesure;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Mesure entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MesureRepository extends JpaRepository<Mesure, Long> {}
