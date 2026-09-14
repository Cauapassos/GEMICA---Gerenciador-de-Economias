package br.com.dashboarddinheiro.DashboardDinheiro.model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@DiscriminatorValue("FIXA")
public class DespesaFixa extends Despesa{

    private Date dataInicio;

    private Date dataFim;

    public DespesaFixa (){}

    public DespesaFixa(Date dataInicio, Date dataFim){
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
    }

    public Date getDataFim() {
        return dataFim;
    }

    public Date getDataInicio() {
        return dataInicio;
    }

    public void setDataFim(Date dataFim) {
        this.dataFim = dataFim;
    }
}
