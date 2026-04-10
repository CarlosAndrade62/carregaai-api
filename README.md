📦 Módulo: Loading Control (CarregaAí)

Este módulo é responsável pelo controle de carregamento de veículos.

🔐 Autenticação

Todos os endpoints requerem JWT:

Authorization: Bearer {token}

O tenantId é obtido automaticamente do token.

📊 Estrutura de Dados
Campo	Tipo	Descrição
id	int	ID gerado pelo sistema Delphi
plate	string	Placa do veículo
material	string	Material
quantity	decimal	Quantidade principal
additionalQuantity	decimal	Ajuste (+ ou -)
status	int	Status do carregamento
🔄 Status
Valor	Descrição
0	Aguardando
1	Carregando
5	Concluído
9	Cancelado
🚀 Endpoints
🔹 Criar carregamento

POST /loading-control

Exemplo:

{
"id": 1001,
"plate": "ABC1D23",
"material": "Brita",
"quantity": 20.5,
"additionalQuantity": 0,
"status": 0
}

🔹 Atualizar carregamento

PATCH /loading-control/:id

Exemplos:

{
"status": 1
}

{
"additionalQuantity": -2.5
}

{
"status": 5,
"quantity": 18
}

🔹 Listar carregamentos

GET /loading-control

Query Params
Param	Tipo	Descrição
skip	int	Quantidade a pular
take	int	Quantidade a retornar
statusLt	int	Status menor que
Exemplos

Listar tudo:
GET /loading-control

Paginação:
GET /loading-control?skip=0&take=10

Em andamento:
GET /loading-control?statusLt=5

Combinado:
GET /loading-control?statusLt=5&skip=0&take=10

🔹 Buscar por ID

GET /loading-control/:id

📦 Resposta da API (paginada)

{
"items": [
{
"id": 1001,
"plate": "ABC1D23",
"material": "Brita",
"quantity": 20.5,
"additionalQuantity": 0,
"status": 1
}
],
"total": 1,
"skip": 0,
"take": 10
}

📌 Regras de Negócio
Multi-tenant (isolado por tenantId)
id vem do sistema Delphi
additionalQuantity:
positivo → adiciona carga
negativo → remove carga
Fluxo de status

0 → 1 → 5
   ↘
    9

🛠️ Stack
NestJS
Prisma
PostgreSQL