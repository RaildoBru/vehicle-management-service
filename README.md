# [Vehicle Management Service] - Avaliação de Pós-Graduação

//Este repositório contém o microserviço desenvolvido como parte da avaliação para o curso de Pós-Graduação em [Nome do Seu Curso, ex: Engenharia de Software / Arquitetura de Software].

O projeto consiste em um microserviço conteinerizado que expõe uma API para [breve descrição da funcionalidade principal, ex: processamento de pagamentos / gerenciamento de usuários].

---

## 🛠️ Tecnologias Utilizadas

* **Linguagem/Framework:** [ Node.js com Express.js]
* **Banco de Dados:** [PostgreSQL]
* **Containerização:** Docker & Docker Compose
* **[Outra tecnologia importante, se houver]:** [Ex: Redis, RabbitMQ, etc.]

## 📐 Arquitetura e Estrutura do Projeto

O projeto foi desenhado seguindo os princípios de microsserviços, garantindo o isolamento de escopo e facilidade de escala. 

A infraestrutura é gerenciada inteiramente via **Docker Compose**, que orquestra os seguintes serviços:
1.  **`app`**: O container da aplicação (microserviço).
2.  **`db`**: O container do banco de dados persistente.

---

## 🚀 Como Executar o Projeto

Graças ao uso do Docker, você não precisa instalar o banco de dados ou dependências da linguagem localmente. Você só precisará do **Docker** e do **Docker Compose** instalados na sua máquina.

### Pré-requisitos
* [Docker](https://docs.docker.com/get-docker/)
* [Docker Compose](https://docs.docker.com/compose/install/)

### Passo a Passo

1.  **Clonar o repositório:**
    
    #### Via HTTPS

    ```bash
    git clone https://github.com/RaildoBru/vehicle-management-service.git
    cd vehicle-management-service
    ```
    #### Via SSH

    ```bash
    git clone git@github.com:RaildoBru/vehicle-management-service.git
    cd vehicle-management-service
    ```


2.  **Configurar as variáveis de ambiente:**
    Copie o arquivo de exemplo de ambiente (se houver) e ajuste se necessário:
    ```bash
    cp .env.example .env
    ```
    *(Nota: As configurações padrão do `.env` já estão prontas para funcionar com o Docker Compose).*

3.  **Subir os containers:**
    Execute o comando abaixo para baixar as imagens, buildar a aplicação e iniciar os serviços:
    ```bash
    docker compose up -d
    ```

    Execute o comando abaixo para cria as tabelas com o prisma:
    ```bash
    docker exec -it vehicle-management-service npx prisma db push
    ```
    *Se preferir rodar em segundo plano, adicione a flag `-d`: `docker compose up -d`*

4.  **Acessar a aplicação:**
    A API estará disponível em: `http://localhost:[PORTA_DA_SUA_APP]` (ex: `http://localhost:3000`).

---

## 🔌 Principais Endpoints da API

Abaixo estão os endpoints principais para testar a aplicação:

| Método | Endpoint | Descrição | Payload (Se houver) |
| :--- | :--- | :--- | :--- |
| **GET** | `api/health` | Verifica se a API e o Banco estão online | Nenhum |
| **GET** | `/api/api-docs` | Lista a documentação | Docs` |

---
