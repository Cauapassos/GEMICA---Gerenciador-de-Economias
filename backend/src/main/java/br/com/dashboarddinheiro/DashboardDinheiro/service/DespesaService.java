package br.com.dashboarddinheiro.DashboardDinheiro.service;

import br.com.dashboarddinheiro.DashboardDinheiro.repository.DespesaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DespesaService {
    @Autowired
    private DespesaRepository despesaRepository;
    public DespesaService(DespesaRepository despesaRepository){
        this.despesaRepository = despesaRepository;
    }
}
