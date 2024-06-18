const fs = require('fs');
const path = require('path');
const { Dispositivos } = require('../models');
const moment = require('moment-timezone')

exports.create = async (req, res) => {
    const lastVersion = req.body['x-esp8266-version']; // Obtém a última versão do dispositivo
    const deviceDescription = req.body['descricao']; // Obtém a descrição do dispositivo

    if (lastVersion === undefined) 
        return res.status(400).json({ error: `A versão do dispositivo não foi fornecida` });

    if (deviceDescription === undefined) 
        return res.status(400).json({ error: `A descrição do dispositivo não foi fornecida` });

    console.log(lastVersion, deviceDescription)

    try {
        deviceTable = await Dispositivos.findOne({
            where: {
                "descricao": deviceDescription
            }
        })
    } catch (error) {
        console.error('Erro ao buscar registros:', error);
        return res.status(500).json({ error: 'Erro ao buscar registros' });
    }

    if (deviceTable !== null)
        return res.status(409).json({ message: `O dispositivo já está cadastrado! Seu tipo é ${deviceTable.id}` })

    try {
        console.log(`O tipo do dispositivo é ${deviceDescription}`);
        const device = await Dispositivos.create({
            versao: lastVersion,
            descricao: deviceDescription
        });
        const dirPath = path.join(__dirname, `../update/${deviceDescription}`);

        fs.mkdir(dirPath, { recursive: true }, (err) => {
            if (err) {
                console.error('Erro ao criar a pasta:', err);
                return res.status(500).json({ error: 'Erro ao criar a pasta para o dispositivo' });
            }
            console.log(`Pasta criada com sucesso: ${dirPath}`);
        });
        return res.status(200).json({ message: `Dispositivo criado com sucesso! Seu tipo é ${device.id}` });
    } catch (error) {
        console.error('Erro ao criar o dispositivo:', error);
        return res.status(500).json({ error: 'Erro ao criar o dispositivo' });
    }

    // Criar uma pasta com o nome da descrição do dispositivo
    
};

exports.update = async (req, res) => {
    const deviceDescription = req.body['descricao']; // Obtém a descrição do dispositivo
    if (deviceDescription === undefined) 
        return res.status(400).json({ error: `A descrição do dispositivo não foi fornecida` })

    const lastVersion = req.body['x-esp8266-version']; // Obtém a última versão do dispositivo
    const newDeviceDescription = req.body['novaDescricao'];

    if (newDeviceDescription === undefined && lastVersion === undefined) 
        return res.status(400).json({ error: `Nenhum campo fornecido para atualização!` })

    try {
        const device = await Dispositivos.findOne({
            where: {
                descricao: deviceDescription
            }
        });

        if (!device) {
            return res.status(404).json({ error: 'Dispositivo não encontrado' });
        }

        // Atualiza os valores apenas se eles foram passados no corpo da requisição
        const versaoAtualizada = lastVersion !== undefined ? lastVersion : device.versao;
        const descricaoAtualizada = newDeviceDescription !== undefined ? newDeviceDescription : device.descricao;
        const dataHoraAtualizacao = moment().tz('America/Sao_Paulo').format();

        const updateDevice = await device.update({
            versao: versaoAtualizada,
            descricao: descricaoAtualizada,
            datahoraAtualizacao: dataHoraAtualizacao
        });

        res.status(200).json(updateDevice); // Retorna o dispositivo atualizado
    } catch (error) {
        console.error('Erro ao atualizar o dispositivo:', error);
        return res.status(500).json({ error: 'Erro ao atualizar o dispositivo' });
    }
}


exports.destroy = async (req, res) => {
    const deviceDescription = req.body['descricao']; // Obtém a descrição do dispositivo
    if (deviceDescription === undefined) 
        return res.status(400).json({ error: `A descrição do dispositivo não foi fornecida` })

    try {
        const device = await Dispositivos.findOne({
            where: {
                descricao: deviceDescription
            }
        });

        if (!device) {
            return res.status(404).json({ error: 'Dispositivo não encontrado' });
        }

        await device.destroy();
        const dirPath = path.join(__dirname, `../update/${deviceDescription}`);

        fs.rm(dirPath, { recursive: true }, (err) => {
            if (err) {
                console.error('Erro ao remover a pasta:', err);
                return res.status(500).json({ error: 'Erro ao remover a pasta para o dispositivo' });
            }
            console.log(`Pasta removida com sucesso: ${dirPath}`);
        });
        res.status(200).json({ message: `O dispositivo ${device.descricao} foi deletado com sucesso` });
    } catch (error) {
        console.error('Erro ao deletar o dispositivo:', error);
        return res.status(500).json({ error: 'Erro ao deletar o dispositivo' });
    }
}
