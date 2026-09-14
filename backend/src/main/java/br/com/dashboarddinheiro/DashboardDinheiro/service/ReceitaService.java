package br.com.dashboarddinheiro.DashboardDinheiro.service;

import br.com.dashboarddinheiro.DashboardDinheiro.repository.ReceitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReceitaService {
    @Autowired
    private ReceitaRepository receitaRepository;

    public ReceitaService(ReceitaRepository receitaRepository){
        this.receitaRepository = receitaRepository;
    }
}
