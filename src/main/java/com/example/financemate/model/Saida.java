package com.example.financemate.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "saida")
public class Saida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private int id;

    @Column(nullable = false)
    private String data;

    @Column(nullable = false)
    private String categoria;

    @Column(nullable = false)
    private float valor;

    // Getters e Setters

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
    
    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public float getValor() {
        return valor;
    }

    public void setValor(float valor) {
        this.valor = valor;
    }

    public int getId() {
        return id;
    }

    public void setIdMov(int id) {
        this.id = id;
    }
}
