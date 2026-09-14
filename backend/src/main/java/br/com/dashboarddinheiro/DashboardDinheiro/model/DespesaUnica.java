package br.com.dashboarddinheiro.DashboardDinheiro.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.util.Date;

@Entity
@DiscriminatorValue("UNICA")
public class DespesaUnica extends Despesa{

    private Date dataUnica;

    public DespesaUnica(){}

    public DespesaUnica(Date dataUnica){
        this.dataUnica = dataUnica;
    }

    public Date getDataUnica() {
        return dataUnica;
    }
}
