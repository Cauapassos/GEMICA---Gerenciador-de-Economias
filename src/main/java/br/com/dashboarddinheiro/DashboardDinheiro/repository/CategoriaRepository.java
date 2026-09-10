package br.com.dashboarddinheiro.DashboardDinheiro.repository;

import br.com.dashboarddinheiro.DashboardDinheiro.model.Categoria;
import br.com.dashboarddinheiro.DashboardDinheiro.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    
}
