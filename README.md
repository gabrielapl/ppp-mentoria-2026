# Almoxarifado API

API REST para gerenciamento de inventário e movimentação de produtos de um almoxarifado.

## Estrutura do projeto

- `src/index.js` - ponto de entrada da aplicação
- `src/routes/index.js` - rotas da API
- `src/controllers` - controladores de request
- `src/services` - regras de negócio e manipulação de dados
- `src/models/db.js` - banco de dados em memória
- `src/middlewares/authMiddleware.js` - autenticação JWT e autorização de perfil
- `resources/swagger.json` - especificação OpenAPI

## Funcionalidades

- Login de funcionários
- Cadastro de gerente no primeiro registro
- Cadastro de funcionários feito apenas por gerentes autenticados
- Consulta de produtos no inventário
- Busca de produto específico
- Registro de entrada de produtos
- Registro de retirada de produtos
- Alteração de registros
- Exclusão de registros (apenas gerentes)

## Autenticação e autorização

- Todos os endpoints de gerenciamento exigem JWT
- O primeiro cadastro de funcionário deve ser de um gerente (`role: "manager"`)
- Após o primeiro cadastro, somente gerentes autenticados podem cadastrar novos funcionários
- Funcionários do almoxarifado podem consultar o inventário, registrar entradas/retiradas e alterar registros
- Gerentes podem consultar, cadastrar, alterar e excluir registros

## Endpoints

- `POST /api/employees/register`
- `POST /api/employees/login`
- `GET /api/employees`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `GET /api/records`
- `GET /api/records/:id`
- `POST /api/records/entry`
- `POST /api/records/withdrawal`
- `PUT /api/records/:id`
- `DELETE /api/records/:id`

## Documentação

- Swagger disponível em `http://localhost:3000/api-docs`
- Arquivo OpenAPI: `resources/swagger.json`

## Instalação

```bash
npm install express swagger-ui-express jsonwebtoken bcryptjs
```

## Execução

```bash
npm start
```
