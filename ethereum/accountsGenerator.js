const HDWalletProvider = require('truffle-hdwallet-provider');
const keythereum = require('keythereum');
const Web3 = require('web3');
const Config = require('../src/_configs/Config');
const fs = require('fs-extra');
const Utils = require('../utils/Utils');

const NUM_ACCOUNT = 1000;
const ETH_AMOUNT = '0.01';
const TOKEN_AMOUNT = 10000 * 100000000;

const fileDir = __dirname + '/gen/rawAccounts.txt';

async function readCurrentRawFile() {
    let fileContent = "";
    try {
        let bufferContent = await fs.readFile(fileDir);
        fileContent = bufferContent.toString();
    } catch(err) {
        console.log(err.message);
    }
    return fileContent;
}

async function writeRawContent(fileContent) {
    fs.outputFile(fileDir, fileContent, err => {
        if (err) {
            console.log(err) // => null
        }
    });
}

async function mainRun() {
    let provider = new HDWalletProvider(
        'crystal hill lonely manual struggle cabin retire abuse cable spell orange predict',
        Config.NETWORK_LIST[1].providerUrl
    );
    let web3 = new Web3(provider);

    let compiledTokenContract = require('./build/PAToken.json');
    let tokenContract = await new web3.eth.Contract(JSON.parse(compiledTokenContract.interface), '0x9c2fA57F790e14dD686146CC4cdAfB4e87d90F2B');

    let fileContent = await readCurrentRawFile();

    for (var i=0; i < NUM_ACCOUNT; i++) {
        let dk = keythereum.create();
        fileContent += dk.privateKey.toString('hex') + '\n';

        let address = Utils.privateToAddress(dk.privateKey);

        // Send ETH
        await web3.eth.sendTransaction({
            from: '0x1297F794032bD97a16474B202d0a69758f8bE707',
            to: address,
            gas: '100000',
            value: web3.utils.toWei(ETH_AMOUNT, 'ether').toString(),
            gasPrice: web3.utils.toWei('1', 'gwei').toString()
        });
        console.log('ETH sent to: ' + address);

        // Send Token
        await tokenContract.methods.transfer(address, TOKEN_AMOUNT)
            .send({
                from: '0x1297F794032bD97a16474B202d0a69758f8bE707',
                gas: '100000',
                gasPrice: web3.utils.toWei('1', 'gwei').toString()
            });
        console.log('Token sent to: ' + address);

        writeRawContent(fileContent);
    }
}

mainRun();