package uni.it.stdmanager.modules.vi_registration.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.vi_registration.entity.RegistrationPeriod;

import java.util.UUID;
import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationPeriodRepository extends JpaRepository<RegistrationPeriod, UUID> {

    @Override
    @EntityGraph(attributePaths = { "semester" })
    List<RegistrationPeriod> findAll();

    @Override
    @EntityGraph(attributePaths = { "semester" })
    Optional<RegistrationPeriod> findById(UUID id);

    @EntityGraph(attributePaths = { "semester" })
    List<RegistrationPeriod> findByIsActiveTrue();
}
