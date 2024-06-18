'use strict';

// Importação dos módulos necessários
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');

// Obtenção do nome do arquivo atual
const basename = path.basename(__filename);

// Definição do ambiente como 'development' se não estiver definido
const env = process.env.NODE_ENV || 'development';

// Carregamento das configurações do banco de dados do arquivo de configuração
const config = require(__dirname + '/../config/config.json')[env];

// Objeto para armazenar os modelos do banco de dados
const db = {};

// Inicialização da instância do Sequelize
let sequelize;
if (config.use_env_variable) {
  // Usar variável de ambiente para conexão com o banco de dados, se disponível
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // Usar configurações do arquivo de configuração para conexão com o banco de dados
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Leitura de todos os arquivos no diretório atual
fs
  .readdirSync(__dirname)
  .filter(file => {
    // Filtragem dos arquivos para excluir arquivos ocultos, o próprio arquivo atual e arquivos de teste
    return (
      file.indexOf('.') !== 0 &&    // Não é um arquivo oculto
      file !== basename &&           // Não é o próprio arquivo atual
      file.slice(-3) === '.js' &&    // É um arquivo JavaScript
      file.indexOf('.test.js') === -1 // Não é um arquivo de teste
    );
  })
  .forEach(file => {
    // Importação e inicialização dos modelos do banco de dados
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Associação entre os modelos, se houver uma função de associação definida
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Adição das instâncias do Sequelize ao objeto db para exportação
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Exportação do objeto db
module.exports = db;