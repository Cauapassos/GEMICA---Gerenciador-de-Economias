package br.com.dashboarddinheiro.DashboardDinheiro.repository;

import br.com.dashboarddinheiro.DashboardDinheiro.model.Categoria;
import br.com.dashboarddinheiro.DashboardDinheiro.model.Despesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface DespesaRepository extends JpaRepository<Despesa, Long> {
    List<Despesa> findByCategoria(String categoria);

    List<Despesa> findByValor(Double valor);

    List<Despesa> findByNome(String nome);

    List<Despesa> findByDescricao(String descricao);

}
