# 🚛 CarregaAí API

Backend do sistema **CarregaAí**, responsável pela gestão de carregamentos com controle por empresa (multi-tenant), autenticação de usuários e integração futura com sistemas de pesagem e autorização de carga.

---

## 🎯 Objetivo

Automatizar o processo de carregamento de veículos, eliminando a necessidade de operador na balança e permitindo controle completo do fluxo:

* Entrada do veículo
* Autorização de carregamento
* Pesagem (entrada e saída)
* Finalização do processo

---

## 🏗️ Tecnologias Utilizadas

* **Node.js**
* **NestJS**
* **Prisma ORM**
* **PostgreSQL**
* **JWT (Autenticação)**
* **Bcrypt (Hash de senha)**

---

## 🧱 Arquitetura

* **Multi-tenant** (cada empresa isolada por `tenantId`)
* Autenticação via JWT
* Estrutura modular (NestJS)

---

## ⚙️ Configuração do Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/CarlosAndrade62/carregaai-api.git
cd carregaai-api
```

---

### 2. Instalar dependências

```bash
pnpm install
```

---

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/carregaai"
JWT_SECRET="sua_chave_secreta"
```

---

### 4. Rodar migrations

```bash
npx prisma migrate dev
```

---

### 5. Iniciar o projeto

```bash
pnpm run start:dev
```

Servidor disponível em:

```
http://localhost:3000
```

---

## 🔐 Autenticação

### 📌 Register

Cria um usuário vinculado a um tenant existente.

**POST** `/auth/register`

```json
{
  "username": "carlos",
  "password": "123456",
  "tenantId": 1
}
```

---

### 📌 Login

**POST** `/auth/login`

```json
{
  "username": "carlos",
  "password": "123456",
  "tenantId": 1
}
```

**Resposta:**

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "tenantId": 1,
  "username": "carlos"
}
```

---

### 📌 Rota protegida (exemplo)

**GET** `/auth/debug`

Header:

```
Authorization: Bearer SEU_TOKEN
```

---

## 🗄️ Modelos principais

### Tenant

Representa a empresa

### User

Usuário do sistema vinculado a um tenant

---

## 🚧 Próximas funcionalidades

* [ ] Módulo de carregamentos (Load)
* [ ] Controle de status (entrada, pesagem, saída)
* [ ] Integração com sistema SIGA
* [ ] Integração com balança
* [ ] Interface web (React)
* [ ] Logs operacionais

---

## 🧠 Regras de Negócio

* Usuário é único por `tenant`
* Autenticação obrigatória para acesso
* Isolamento de dados por empresa

---

## 👨‍💻 Autor

Carlos Roberto Soares Andrade
CRSA Consultoria LTDA

---

## 📄 Licença

## Uso interno / sob contrato
