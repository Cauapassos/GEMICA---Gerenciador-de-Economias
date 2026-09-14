package br.com.dashboarddinheiro.DashboardDinheiro.model;


import jakarta.persistence.*;


@Entity
@Table(name = "receita")
public class Receita {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private String descricao;

    private Double valor;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Receita(){}

    public Receita(String nome, String descricao, Double valor){
        this.nome = nome;
        this.descricao = descricao;
        this.valor = valor;
    }

    public String getDescricao() {
        return descricao;
    }

    public String getNome() {
        return nome;
    }


    public Double getValor(){
        return valor;
    }

    public Long getId() {
        return id;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

}
