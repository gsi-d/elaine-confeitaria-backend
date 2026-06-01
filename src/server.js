const app = require('./app');
const { port } = require('./config/env');

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});

