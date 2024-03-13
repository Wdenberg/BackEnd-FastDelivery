import app from "./app";

const portServer = process.env.PORT || 3001;

app.listen(portServer, (): void => {
  console.log(`Servidor rodando na porta ${portServer} - ${new Date()}`);
});
