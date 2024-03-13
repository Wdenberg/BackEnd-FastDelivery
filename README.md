
### Api Basica do Sitema Fast Delivery

Api desenvolvida em NodeJs Junto com o Vite usando o TypeScript
Com Intregação de Teste Unitarios


### PRincipais Tecnologias Usadas
NodeJS
TypeScript
Exress
UUID V4

Banco de Dados MongoDBS

### Principais Routes
```
    router.post("/create", UserController.create);
    router.get("/", UserController.getUsers);
    router.get("/:id", UserController.getUser);
    router.patch("/update/:id", UserController.update);
    router.post("/delete/:id", UserController.delete);


```

``` 
 scripts: {
    "dev": "tsx watch src/server.ts",
    "test": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:interface": "vitest --ui",
    "build": "tsup src --loader .log=text --loader .html=text --loader .xml=text"
  }
```
Falta algumas Implementação e atualizações
