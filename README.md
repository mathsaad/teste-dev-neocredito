# Gerenciamento de Repositórios do GitHub  

Este projeto permite pesquisar, exportar e importar repositórios do GitHub. Ele possui um **backend** em NestJS e um **frontend** em React, rodando via **Docker** ou manualmente com Yarn.  

---

## **Estrutura do Projeto**  
```
/projeto
│── /frontend  # Aplicação React (interface)
│── /server    # Backend NestJS
│── docker-compose.yml
│── README.md
```

---

## **Configuração do Ambiente**  

### **Configurar Variáveis de Ambiente**  
Crie um arquivo **`.env`** no diretório do frontend (`frontend/.env`) com:  

```env
REACT_APP_API_BASE_URL=http://localhost:3001
```

Crie um arquivo **`.env`** no backend (`server/.env`) com:  

```env
PORT=3001

DB_HOST=mariadb
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=github_repos

GITHUB_TOKEN=TokenGithub
```

para gerar o token do github acesse: https://github.com/settings/tokens

---

## **Instalando Dependências e Executando o Projeto**  

### **Usando Docker (Recomendado)**
1. **Iniciar o projeto**  
   ```sh
   docker-compose up --build
   ```
2. **Acessar os serviços**:  
   - **Frontend**: [`http://localhost:3000`](http://localhost:3000)  
   - **Backend**: [`http://localhost:3001`](http://localhost:3001)
   - **Swagger Backend**: [`http://localhost:3001/api-docs`](http://localhost:3001/api-docs) 
   - **RabbitMQ Dashboard**: [`http://localhost:15672`](http://localhost:15672) (Usuário: `guest`, Senha: `guest`)  

3. **Parar os containers**  
   ```sh
   docker-compose down
   ```

---

### **Executando Manualmente (Sem Docker)**  

#### **1️⃣ Backend (`server`)**
```sh
cd server
yarn install
yarn start
```

#### **Frontend (`frontend`)**
```sh
cd frontend
yarn install
yarn start
```
> O frontend estará disponível em [`http://localhost:3000`](http://localhost:3000).  

---

## **Testes**
### **Testes do Backend**
Para rodar os testes unitários do backend:  
```sh
cd server
yarn test:cov
```

---

## ** Pronto!**
Agora você pode usar o projeto para **pesquisar e importar repositórios do GitHub**! 

Caso tenha dúvidas, entre em contato.
