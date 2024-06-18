const { Sequelize } = require('sequelize');
// Definição do ambiente como 'development' se não estiver definido
const env = process.env.NODE_ENV || 'development';

// Carregamento das configurações do banco de dados do arquivo de configuração
const config = require(__dirname + '/../config/config.json')[env];

const sequelize = new Sequelize(config);

async function configureDatabase() {
  try {
    // Autentica a conexão
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Erro ao autenticar a conexão:', error);
  }
}

configureDatabase();

module.exports = sequelize;
