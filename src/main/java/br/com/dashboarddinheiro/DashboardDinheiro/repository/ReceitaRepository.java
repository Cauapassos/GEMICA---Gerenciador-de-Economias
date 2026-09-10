package br.com.dashboarddinheiro.DashboardDinheiro.repository;

import br.com.dashboarddinheiro.DashboardDinheiro.model.Receita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReceitaRepository extends JpaRepository<Receita, Long> {
    List<Receita> findByDescricao(String descricao);

    List<Receita> findByValor(double valor);

    List<Receita> findByNome(String nome);
}
