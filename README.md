# Tasks API

Esse é um projeto simples que utiliza do Firebase Firestore e Firebase Cloud Functions para prover alguns endpoints de uma aplicação de TODO list, a serem utilizados para a construção do app [FlutterPad](https://github.com/toshiossada/FlutterPad), pela squad "Tela Trincada" da comunidade [Bichinhos da TI](https://discord.com/invite/bichinhosti).

# Utilizando a API

## Configuração Base

Todas as requisições devem ser feitas utilizando a seguinte BASE URL: `https://us-central1-flutterpad-bichinhosti.cloudfunctions.net`

## Obtendo ID de usuário

Esse endpoint retorna um id de usuário a partir de um dado nickname na requisição. Para todas as requisições subsequentes, deve ser enviado o parâmetro `userId` nos queryParameters da requisição.

```
[GET] /api/id
```

#### Atributos:

| Atributo | Tipo de Dado | Tipo de Atributo | Obrigatório |
| -------- | ------------ | ---------------- | ----------- |
| nickname | string       | query            | Sim         |

#### Resposta da Requisição:

Em caso de sucesso, será retornado o código 200 com um corpo semelhante a:

```json
{
  "userId": "gTVFlDnQcaoDwSBRGx0q"
}
```

## Criando Tarefa

Endpoint para a criação de uma tarefa. Todas as tarefas criadas são atríbuidas a um identificador e têm o atributo `completed` colocado como `false`.

```
[POST] /api/tasks
```

#### Atributos:

| Atributo    | Tipo de Dado | Tipo de Atributo | Obrigatório | Observação                                                            |
| ----------- | ------------ | ---------------- | ----------- | --------------------------------------------------------------------- |
| userId      | string       | query            | Sim         | ID do usuário                                                         |
| title       | string       | body             | Sim         |                                                                       |
| description | string       | body             | Sim         |                                                                       |
| date        | string       | body             | Sim         | Deve ser uma data representada como ISO String                        |
| category    | string       | body             | Sim         | Deve ser uma das seguintes strings: "TASKS", "EVENT" ou "ACHIEVEMENT" |

#### Resposta da Requisição:

Em caso de sucesso, será retornado o código 200 com um corpo semelhante a:

```json
{
  "title": "Estudar",
  "description": "Flutter",
  "category": "TASK",
  "date": "2024-01-11T20:00:00.000Z",
  "completed": false,
  "id": "3VmxWuDOBKs3F18MYIhd"
}
```

## Obtendo todas as tarefas

Endpoint para obter todas as tarefas de um usuário, retornando uma lista de tarefas. Caso não haja nenhuma, será retornado uma lista vazia.

```
[GET] /api/tasks
```

#### Atributos:

| Atributo | Tipo de Dado | Tipo de Atributo | Obrigatório | Observação    |
| -------- | ------------ | ---------------- | ----------- | ------------- |
| userId   | string       | query            | Sim         | ID do usuário |

#### Resposta da Requisição:

Em caso de sucesso, será retornado o código 200 com um corpo semelhante a:

```json
[
  {
    "title": "Estudar",
    "description": "Flutter",
    "category": "TASK",
    "date": "2024-01-11T20:00:00.000Z",
    "completed": false,
    "id": "3VmxWuDOBKs3F18MYIhd"
  },
  {
    "title": "Weekly Squad Tela Trincada",
    "description": "Continuar desenvolvimento do APP",
    "category": "EVENT",
    "date": "2024-01-17T19:00:00.000Z",
    "completed": false,
    "id": "Cs9cRypERGGcif12iWxn"
  }
]
```

## Editando Tarefa

Endpoint para a editar uma tarefa, podendo ser usada tanto para editar os dados em si da tarefa, quanto para marcá-la com concluída.

```
[PUT] /api/tasks
```

#### Atributos:

| Atributo    | Tipo de Dado | Tipo de Atributo | Obrigatório | Observação                                                            |
| ----------- | ------------ | ---------------- | ----------- | --------------------------------------------------------------------- |
| userId      | string       | query            | Sim         | ID do usuário                                                         |
| id          | string       | body             | Sim         | ID da tarefa                                                          |
| title       | string       | body             | Não         |                                                                       |
| description | string       | body             | Não         |                                                                       |
| date        | string       | body             | Não         | Deve ser uma data representada como ISO String                        |
| category    | string       | body             | Não         | Deve ser uma das seguintes strings: "TASKS", "EVENT" ou "ACHIEVEMENT" |

#### Resposta da Requisição:

Em caso de sucesso, será retornado o código 200 com um corpo vazio.

## Deletando Tarefa

Endpoint para a deletar uma tarefa/

```
[DELETE] /api/tasks
```

#### Atributos:

| Atributo | Tipo de Dado | Tipo de Atributo | Obrigatório | Observação    |
| -------- | ------------ | ---------------- | ----------- | ------------- |
| userId   | string       | query            | Sim         | ID do usuário |
| id       | string       | body             | Sim         | ID da tarefa  |

#### Resposta da Requisição:

Em caso de sucesso, será retornado o código 200 com um corpo vazio.
