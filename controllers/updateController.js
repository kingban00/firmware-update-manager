const path = require('path'); // Importa path para manipular caminhos de arquivos
const { Dispositivos, Logs } = require('../models');

exports.updateDispositivo = async (req, res) => {

    const deviceType = req.header('type') // Recebe o tipo do dispositivo
    const macAddress = req.header('mac') // Recebe o mac do dispositivo
    if (macAddress === undefined || deviceType === undefined){
        console.log(`O tipo do dispositivo fornecido foi:${deviceType}\nO endereço mac fornecido foi: ${macAddress}`)
        return res.status(400).json({ error: `Informações essenciais do dispositivo não foram fornecidas! *mac: ${macAddress}* *Tipo do dispositivo: ${deviceType}*.` })
    }

    // Recebe a versão atual do dispositivo
    const versionHeader = req.header('x-esp8266-version'); // Obtém a versão do cabeçalho da requisição
    const currentVersion = versionHeader ? parseFloat(versionHeader) : Infinity; // Converte a versão para número ou define como Infinito para evitar atualizações erradas causadas por erros na requisição
    console.log(`Versão solicitada: ${currentVersion}`);

    try {
        console.log(`O tipo do dispositivo é ${deviceType}`)
        lastVersion = await Dispositivos.findAll({
            where: {
                "id": deviceType
            },
            attributes: ['versao', 'descricao']
        })
        console.log(lastVersion)
    } catch (error) {
        console.error('Erro ao buscar registros:', error);
        return res.status(500).json({ error: 'Erro ao buscar registros' });
    }

    // Executa a comparação geral para o dispositivo
    
    if (lastVersion.length === 0) {
        console.log('Dispositivo não encontrado');
        return res.status(404).json({ error: 'Dispositivo não cadastrado!' });
    }

    else if (currentVersion < lastVersion[0].versao) { // Verifica se a versão do cliente é menor que a versão mais recente
        const filePath = path.join(__dirname, `../update/${lastVersion[0].descricao}/httpUpdateNew.bin`); // Caminho do arquivo de atualização
         
        res.download(filePath, 'httpUpdateNew.bin', (err) => { // Envia o arquivo para download
            if (err) {
                console.error('Problema no download do firmware:', err); // Loga o erro se houver
                return res.status(500).send(`Erro no download do firmware: ${err}`); // Responde com erro 500
            } else {
                Logs.create({macAddress: macAddress, tipo: lastVersion[0].descricao})
                console.log(`${filePath}.\nO Firmware foi baixado!`); 
            }
        });
    } else {
        if (currentVersion === Infinity) {
            return res.status(400).json({ message: 'Versão atual do dispositivo não foi fornecida' })
        }
        console.log('O dispositivo já possui a última versão do firmware!')
        return res.status(204).send() // Responde que o dispositivo está atualizado
    }
}  