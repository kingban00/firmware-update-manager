const express = require('express'); // Importa o framework Express para criar o servidor
// const { networkInterfaces } = require('os'); // Importa a função networkInterfaces para obter informações sobre as interfaces de rede
const updateRoutes = require('./routes/update'); // Importa as rotas de atualização
const PORT = 3000
const app = express(); // Cria uma instância do Express
// const nets = networkInterfaces(); // Obtém as interfaces de rede

// Usa as rotas de atualização definidas em outro arquivo
app.use(express.json());
app.use('/', updateRoutes);

// Inicia o servidor na porta definida
app.listen(PORT, () => {
    // const results = {};

    // Obtém endereços IPv4 não internos
    // for (const name of Object.keys(nets)) {
    //     for (const net of nets[name]) {
    //         if (net.family === 'IPv4' && !net.internal) {
    //             if (!results[name]) {
    //                 results[name] = [];
    //             }
    //             results[name].push(net.address);
    //         }
    //     }
    // }

    console.log(`Listening on port ${PORT}\n`); // Exibe a porta
});
