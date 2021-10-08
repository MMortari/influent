# Influent

## To Do

- [x] Cadastro de Cliente
- [x] Cadastro de Influenciador
- [x] Buscador de Cliente
- [x] Buscador de Influenciador
- [x] Acessar Perfil
- [x] Solicitação de Proposta
- [x] Negociação da proposta
- [x] Consolidação de Proposta
- [ ] Feedback de Jobs

## Commands

**Database**

```sh
$ yarn prisma generate

$ yarn prisma migrate dev --name init
```

**Docker**

```sh
$ docker build -t bmortari/influent .

$ docker push bmortari/influent:latest
```

**Kubernetes**

```sh
$ docker build -t bmortari/influent .
```
