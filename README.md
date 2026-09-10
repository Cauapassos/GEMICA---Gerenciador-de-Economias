# DashboardDinheiro

API REST para gerenciamento e análise de dados financeiros pessoais, desenvolvida com Java e Spring Boot.

O projeto tem como objetivo construir um sistema capaz de registrar receitas e despesas, organizar movimentações por categorias e disponibilizar esses dados para um futuro frontend de dashboard financeiro.

Além de desenvolver a aplicação, o projeto está sendo utilizado para aprofundar conhecimentos em desenvolvimento backend, APIs REST, arquitetura em camadas, Spring Boot, JPA/Hibernate, banco de dados relacionais e boas práticas de organização de software.

## Status do projeto

Em desenvolvimento.

A estrutura inicial do domínio e das entidades está sendo construída antes da implementação completa das camadas de serviço e exposição dos endpoints REST.

## Objetivos

* Desenvolver uma API REST para gerenciamento financeiro.
* Registrar receitas e despesas.
* Diferenciar despesas fixas e despesas únicas.
* Organizar despesas através de categorias.
* Associar movimentações financeiras aos seus respectivos usuários.
* Calcular informações financeiras a partir das receitas e despesas.
* Aplicar arquitetura em camadas.
* Utilizar JPA/Hibernate para persistência dos dados.
* Desenvolver uma estrutura preparada para integração com um frontend.
* Praticar conceitos de orientação a objetos, relacionamentos entre entidades e persistência de dados.
* Evoluir posteriormente a aplicação com validações, tratamento de exceções, autenticação, testes e documentação.

## Tecnologias

* Java 21
* Spring Boot
* Spring Web
* Spring Data JPA
* Hibernate
* MySQL
* Maven
* Postman

## Arquitetura

O projeto utiliza uma arquitetura em camadas, separando as responsabilidades da aplicação.

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Cada camada possui uma responsabilidade específica.

### Model

Responsável pela representação das entidades e do domínio da aplicação.

As entidades são mapeadas para o banco de dados utilizando JPA/Hibernate.

Estrutura planejada:

```text
model/
├── Usuario
├── Despesa
├── DespesaFixa
├── DespesaUnica
├── Receita
└── Categoria
```

### Controller

Responsável pela comunicação entre a API e o cliente através do protocolo HTTP.

Os Controllers serão responsáveis por receber as requisições REST, encaminhar as operações para os Services e retornar as respostas apropriadas.

Exemplos:

```text
controller/
├── UsuarioController
├── DespesaController
├── ReceitaController
└── CategoriaController
```

### Service

Responsável pelas regras de negócio da aplicação.

O Controller não deverá concentrar regras de negócio. Em vez disso, as operações serão encaminhadas para os Services.

Exemplo conceitual:

```text
DespesaController
        ↓
DespesaService
        ↓
DespesaRepository
```

### Repository

Responsável pelo acesso aos dados persistidos no banco de dados.

A aplicação utiliza Spring Data JPA para reduzir a necessidade de implementar manualmente operações básicas de persistência.

Exemplo de estrutura:

```text
repository/
├── UsuarioRepository
├── DespesaRepository
├── ReceitaRepository
└── CategoriaRepository
```

### DTO

Os DTOs serão utilizados para controlar os dados recebidos e enviados pela API, evitando que as entidades JPA sejam utilizadas diretamente como contrato da API.

Estrutura planejada:

```text
dto/
├── usuario/
├── despesa/
├── receita/
└── categoria/
```

## Modelagem do domínio

O sistema possui quatro conceitos principais de movimentação e organização financeira:

```text
                    Usuario
                   /       \
                  /         \
                 ↓           ↓
             Receita       Despesa
                              │
                         ┌────┴────┐
                         ↓         ↓
                   DespesaFixa  DespesaUnica
                         │
                         ↓
                     Categoria
```

### Usuario

Representa o usuário do sistema.

Um usuário pode possuir diversas receitas, despesas e, caso o sistema utilize categorias personalizadas, diversas categorias.

Relacionamentos conceituais:

```text
Usuario 1 ─── N Receita

Usuario 1 ─── N Despesa

Usuario 1 ─── N Categoria
```

### Receita

Representa uma entrada financeira.

Uma receita pertence a um usuário, mas não precisa possuir uma relação direta com uma despesa.

Exemplos:

* salário;
* freelance;
* pagamento;
* outras entradas financeiras.

O saldo não é tratado como uma característica da receita. Ele pode ser obtido através do cálculo entre o total de receitas e o total de despesas.

Conceitualmente:

```text
Saldo = Total de Receitas - Total de Despesas
```

### Despesa

Representa uma saída financeira.

A entidade `Despesa` contém os atributos comuns às diferentes modalidades de despesa.

A estrutura utiliza herança para representar diferentes tipos de despesas:

```text
                 Despesa
                    │
          ┌─────────┴─────────┐
          ↓                   ↓
    DespesaFixa         DespesaUnica
```

A intenção é manter na classe `Despesa` apenas os atributos que são comuns aos dois tipos.

Características específicas de uma despesa fixa devem permanecer em `DespesaFixa`, enquanto características específicas de uma despesa única devem permanecer em `DespesaUnica`.

### DespesaFixa

Representa despesas que possuem recorrência ou características próprias de despesas recorrentes.

Exemplos:

* aluguel;
* mensalidades;
* assinaturas;
* serviços recorrentes.

A classe herda os atributos comuns de `Despesa`.

### DespesaUnica

Representa uma despesa que ocorre de maneira pontual.

Exemplos:

* compra de um equipamento;
* compra no supermercado;
* pagamento eventual;
* uma compra específica.

Também herda os atributos comuns de `Despesa`.

### Categoria

Responsável pela classificação das despesas.

Exemplos:

```text
Alimentação
Transporte
Moradia
Lazer
Educação
Saúde
Assinaturas
```

Uma categoria pode estar associada a diversas despesas:

```text
Categoria 1 ─── N Despesas
```

A aplicação poderá utilizar essas informações posteriormente para gerar análises e gráficos financeiros.

## Banco de dados

O projeto utiliza MySQL.

Banco utilizado durante o desenvolvimento:

```text
dashboard_estudo
```

A estrutura das tabelas é gerenciada inicialmente através do JPA/Hibernate a partir das entidades Java.

Durante o desenvolvimento, a configuração do Hibernate pode ser utilizada para criar ou atualizar o schema automaticamente.

A intenção é posteriormente utilizar uma solução de migrations, como Flyway ou Liquibase, para controlar de maneira mais segura a evolução do banco de dados em ambientes de produção.

## Relacionamentos principais

A modelagem atual considera os seguintes relacionamentos:

```text
Usuario
   │
   ├────────────── 1:N ────────────── Receita
   │
   ├────────────── 1:N ────────────── Despesa
   │                                      │
   │                                      │ N:1
   │                                      ↓
   └────────────── 1:N ────────────── Categoria
```

A relação entre `Receita` e `Despesa` é indireta.

As duas representam movimentações financeiras diferentes pertencentes ao mesmo usuário:

```text
Usuario
├── Receitas
└── Despesas
```

Não existe necessidade de uma receita possuir uma despesa diretamente relacionada.

## Herança das despesas

A aplicação utiliza o conceito de herança da orientação a objetos:

```text
Despesa
├── DespesaFixa
└── DespesaUnica
```

A estratégia de herança do JPA será utilizada para representar essa estrutura no banco de dados.

Uma das estratégias consideradas é `JOINED`, na qual os atributos comuns permanecem na tabela da entidade pai e os atributos específicos ficam nas tabelas das entidades filhas.

Conceitualmente:

```text
DESPESA
├── id
├── descricao
├── valor
├── data
├── usuario_id
└── categoria_id

DESPESA_FIXA
├── id
└── atributos específicos

DESPESA_UNICA
├── id
└── atributos específicos
```

Nas subclasses, o identificador é herdado da entidade `Despesa`, portanto não é necessário criar manualmente um segundo `idDespesa` para representar a relação com a entidade pai.

## Fluxo de uma requisição

Uma operação típica da API seguirá o fluxo:

```text
Cliente
   ↓
HTTP Request
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
JPA / Hibernate
   ↓
MySQL
```

Na resposta:

```text
MySQL
   ↓
JPA / Hibernate
   ↓
Repository
   ↓
Service
   ↓
Controller
   ↓
HTTP Response
   ↓
Cliente
```

## Configuração

As configurações principais da aplicação ficam no arquivo:

```text
src/main/resources/application.yml
```

Entre as configurações utilizadas estão:

* nome da aplicação;
* URL de conexão com o MySQL;
* usuário do banco;
* senha do banco;
* driver JDBC;
* configuração do Hibernate;
* porta do servidor.

Credenciais reais não devem ser versionadas no Git.

Para ambientes reais, recomenda-se utilizar variáveis de ambiente ou outro mecanismo seguro de gerenciamento de credenciais.

## Estrutura do projeto

A estrutura planejada da aplicação é semelhante a:

```text
DashboardDinheiro/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── br/
│   │   │       └── com/
│   │   │           └── dashboarddinheiro/
│   │   │               └── DashboardDinheiro/
│   │   │                   │
│   │   │                   ├── controller/
│   │   │                   │
│   │   │                   ├── service/
│   │   │                   │
│   │   │                   ├── repository/
│   │   │                   │
│   │   │                   ├── model/
│   │   │                   │
│   │   │                   ├── dto/
│   │   │                   │
│   │   │                   └── DashboardDinheiroApplication
│   │   │
│   │   └── resources/
│   │       └── application.yml
│   │
│   └── test/
│
├── pom.xml
└── README.md
```

## Endpoints

Os endpoints serão implementados conforme as funcionalidades forem desenvolvidas.

A organização planejada seguirá o padrão REST.

Exemplo conceitual para despesas:

```text
POST   /despesas
GET    /despesas
GET    /despesas/{id}
PUT    /despesas/{id}
DELETE /despesas/{id}
```

O mesmo padrão poderá ser utilizado para outras entidades, como:

```text
/usuarios
/receitas
/categorias
```

Os endpoints definitivos ainda estão em desenvolvimento.

## Validação e tratamento de erros

Como evolução da API, serão implementados mecanismos para:

* validar dados recebidos;
* impedir valores inválidos;
* verificar existência de entidades relacionadas;
* tratar recursos inexistentes;
* retornar códigos HTTP adequados;
* criar respostas de erro padronizadas.

Entre os recursos planejados estão as validações do Jakarta Validation e o tratamento global de exceções através do Spring.

## Desenvolvimento

O projeto está sendo desenvolvido de forma incremental.

A ordem de implementação planejada é:

```text
1. Modelagem do domínio
        ↓
2. Entidades JPA
        ↓
3. Repositories
        ↓
4. Teste da persistência
        ↓
5. Services
        ↓
6. DTOs
        ↓
7. Controllers
        ↓
8. Testes com Postman
        ↓
9. Validações
        ↓
10. Tratamento de exceções
        ↓
11. Testes automatizados
        ↓
12. Segurança e autenticação
        ↓
13. Documentação da API
```

A implementação será feita funcionalidade por funcionalidade, evitando criar todas as camadas do projeto sem testá-las.

## Possíveis funcionalidades futuras

Entre as funcionalidades que podem ser adicionadas ao projeto:

* autenticação de usuários;
* autorização;
* cadastro e gerenciamento de categorias;
* filtros de despesas;
* filtros por período;
* filtros por categoria;
* cálculo de saldo;
* resumo financeiro mensal;
* gráficos de receitas e despesas;
* análise de gastos por categoria;
* paginação;
* ordenação;
* validação de dados;
* tratamento global de exceções;
* testes unitários;
* testes de integração;
* documentação com OpenAPI/Swagger;
* migrations com Flyway ou Liquibase;
* integração com um frontend;
* dashboard financeiro completo.

## Objetivo acadêmico

Além de ser uma aplicação funcional, o DashboardDinheiro está sendo desenvolvido como projeto de estudo para consolidar conhecimentos de desenvolvimento de software e backend.

O projeto permite praticar conceitos como:

* Programação Orientada a Objetos;
* Herança;
* Encapsulamento;
* APIs REST;
* HTTP;
* arquitetura em camadas;
* Injeção de Dependência;
* Spring Boot;
* Spring Data JPA;
* ORM;
* Hibernate;
* JPA;
* relacionamentos entre entidades;
* banco de dados relacional;
* SQL;
* persistência de dados;
* DTOs;
* validação;
* tratamento de exceções;
* testes de API;
* boas práticas de organização de código.

## Licença

Projeto desenvolvido para fins acadêmicos e de estudo.
