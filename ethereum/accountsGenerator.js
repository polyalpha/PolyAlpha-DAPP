// const HDWalletProvider = require('truffle-hdwallet-provider');
const keythereum = require('keythereum');
const Web3 = require('web3');
const Config = require('../src/_configs/Config');
const fs = require('fs-extra');
const Utils = require('../utils/Utils');
const Tx = require('ethereumjs-tx');
const BigNumber = require('bignumber.js');


const NUM_ACCOUNT = 500;
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

const provider = new Web3.providers.HttpProvider(Config.NETWORK_LIST[1].providerUrl);
let web3 = new Web3(provider);

let accounts = {};
let fileContent;

async function mainRun() {
    let compiledTokenContract = require('./build/PAToken.json');
    let tokenContract = await new web3.eth.Contract(JSON.parse(compiledTokenContract.interface), '0x9c2fA57F790e14dD686146CC4cdAfB4e87d90F2B');

    fileContent = await readCurrentRawFile();

    var transactionCount = await web3.eth.getTransactionCount('0x1297F794032bD97a16474B202d0a69758f8bE707');
    var gasPrice = await web3.eth.getGasPrice();

    let ethValue = new BigNumber(web3.utils.toWei(ETH_AMOUNT, 'ether').toString());
    ethValue = '0x' + ethValue.toString(16);


    for (var i=0; i < NUM_ACCOUNT; i++) {
        let dk = keythereum.create();

        let address = Utils.privateToAddress(dk.privateKey);

        accounts[address] = {address, privateKey: dk.privateKey, ethSent: false, tokenSent: false};

        let ethTx = {
            nonce: parseInt(transactionCount + i*2),
            gasPrice: parseInt(gasPrice), //web3.utils.toWei('1', 'gwei'),
            gasLimit: 100000,
            to: address,
            value: ethValue
        }
        
        let data = tokenContract.methods.transfer(address, TOKEN_AMOUNT).encodeABI();
        let tokenTx = {
            nonce: parseInt(transactionCount + i*2 + 1),
            gasPrice: parseInt(gasPrice),
            gasLimit: parseInt(100000),
            to: tokenContract.options.address,
            value: 0,
            data
        }

        // Need to have some delay before sending transactions, otherwise, 
        // the local network connection will unable to handle a large amount
        // of in/out data.
        setTimeout(function() {
            sendRawTx(ethTx, address, 'eth');
            sendRawTx(tokenTx, address, 'token');
        }, i*500);
        
    }
}

function sendRawTx(rawTx, address, type) {
    var tx = new Tx(rawTx);
    tx.sign(Buffer.from('d9f7fa47642327ba9bb81a3ea7d12939fd33cb47786689b2cfa7cd574db62f68', 'hex'));
    var serializedTx = tx.serialize();
    console.log('send: ' + '0x' + tx.hash().toString('hex'));
    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('receipt', (receipt) => {
            // The web3 version 1.0.0-beta.34 keeps sending receipt after the transaction get confirmed
            console.log(receipt);
            done(address, type);
        }).on('error', (err, txHash) => {
            if (err) {
                console.log(type + ": " + err.message);
            }
        });
}

function done(address, type) {
    let a = accounts[address];
    let sentUpdate = false;
    if (type == 'eth' && a.ethSent == false) {
        a.ethSent = true;
        sentUpdate = true;
    } else if (type == 'token' && a.tokenSent == false) {
        a.tokenSent = true;
        sentUpdate = true;
    }

    if (sentUpdate && a.ethSent == true && a.tokenSent == true) {
        console.log('generate user: ' + address);
        fileContent += a.privateKey.toString('hex') + "\n";
        writeRawContent(fileContent);
    }
}

mainRun();