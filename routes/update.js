const express = require('express'); // Importa o Express para criar rotas

const router = express.Router(); // Cria um roteador do Express

//Busca o controlador a ser chamado pela rota
const updateController = require('../controllers/updateController') 
const dispositivoController = require('../controllers/dispositivoController')

// Rotas para servir o firmware atualizado
router.get('/update', updateController.updateDispositivo);

router.post('/dispositivo', dispositivoController.create)

router.put('/dispositivo', dispositivoController.update)

router.delete('/dispositivo', dispositivoController.destroy)

module.exports = router; // Exporta o roteador
