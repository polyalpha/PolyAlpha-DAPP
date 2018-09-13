const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const fs = require('fs-extra');
const {ENV} = require('../src/_configs/Config.js');
const Utils = require('../utils/Utils');
const compiledBidContract = require('../ethereum/build/PAAttentionBidding.json');
const compiledMessagingContract = require('../ethereum/build/PAMessaging.json');
const compiledContract = require('../ethereum/build/PACore.json');

const provider = new Web3.providers.HttpProvider(ENV.ProviderUrl);
const web3 = new Web3(provider);

let bidContract;
let messagingContract;
let contract;
let storedBlockNumber;

var getStoredBlockNumber = async function() {
  try {
    let fileContent = await fs.readFile(__dirname + '/currentBlock.txt');
    return Utils.parseIntSafe(fileContent.toString());
  } catch(err) {
    return 2944099; // 2944099 2800664
  }
}

var storeBlockNumber = function (blockNumber) {
  fs.outputFile(__dirname + '/currentBlock.txt', blockNumber.toString(), err => {
    if (err) console.log(err);
  })
}

var sendNotification = function(message, userAddress) {
  console.log("SEND: '" + message + "' TO: " + userAddress);
  let data =  { 
    app_id: "46982f9a-7dff-40d2-99e1-a295b33ab2dd",
    contents: {"en": message},
    filters: [
        {"field": "tag", "key": "address", "relation": "=", "value": userAddress}
    ]
  };

  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": "Basic YmMwNTliODItNjQ0Yi00ZGQ0LTkyMTMtZTA5ZjkxMDdlZjNh"
  };
  
  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  };
  
  var https = require('https');
  var req = https.request(options, function(res) {  
    res.on('data', function(data) {
      console.log("Response:");
      console.log(JSON.parse(data));
    });
  });
  
  req.on('error', function(e) {
    console.log("ERROR:");
    console.log(e);
  });
  
  req.write(JSON.stringify(data));
  req.end();
};

var processEventsLoop = async function() {
  await processEvents();
  setTimeout(processEventsLoop, 3000);
}

var processEvents = async function() {
  let currentBlockNumber = Utils.parseIntSafe(await web3.eth.getBlockNumber());

  if (currentBlockNumber > storedBlockNumber) {
    console.log('Reading events from ' + storedBlockNumber + ' - ' + currentBlockNumber);
    let bidEvents = await bidContract.getPastEvents('allEvents', {
      fromBlock: storedBlockNumber,
      toBlock: currentBlockNumber
    });

    let msgEvents = await messagingContract.getPastEvents('allEvents', {
      fromBlock: storedBlockNumber,
      toBlock: currentBlockNumber
    })

    for (var i=0;i<bidEvents.length;i++) {
      let name = bidEvents[i].event;
      let values = bidEvents[i].returnValues;
      values.sender = values.sender.toLowerCase();
      values.receiver = values.receiver.toLowerCase();

      let sender = await contract.methods.getUser(values.sender).call();
      console.log(sender);

      if (name == 'BidCreated') {
        let message = 'You received an attention bid from ' + Utils.hexToString(sender[2]);
        sendNotification(message, values.receiver);
      } else if (name == 'BidCancelled') {
        let message = 'Bid from ' + Utils.hexToString(sender[2]) + ' has been cancelled';
        sendNotification(message, values.receiver);
      } else if (name == 'BidAccepted') {
        let message = Utils.hexToString(sender[2]) + ' has accepted your bid';
        sendNotification(message, values.receiver);
      }
    }

    for (var i=0;i<msgEvents.length;i++) {
      let name = msgEvents[i].event;
      let values = msgEvents[i].returnValues;
      values.sender = values.sender.toLowerCase();
      values.receiver = values.receiver.toLowerCase();

      let sender = await contract.methods.getUser(values.sender).call();
      let message = 'You received a message from ' + Utils.hexToString(sender[2]);
      sendNotification(message, values.receiver);
    }
    storedBlockNumber = currentBlockNumber + 1;
    storeBlockNumber(storedBlockNumber);
  }
}

async function mainRun() {
  contract = await new web3.eth.Contract(JSON.parse(compiledContract.interface), 
    ENV.ContractAddress);
  bidContract = await new web3.eth.Contract(JSON.parse(compiledBidContract.interface), 
    ENV.BidContractAddress);
  messagingContract = await new web3.eth.Contract(JSON.parse(compiledMessagingContract.interface), 
    ENV.MessagingContractAddress);

  storedBlockNumber = await getStoredBlockNumber();

  processEventsLoop();
}

mainRun();





// sendNotification("Hello 0x85c9e47db467dab4da7c312b73c2e131802d626a", "0x85c9e47db467dab4da7c312b73c2e131802d626a");

exit = () => {
  process.exit(1);
}

process.on('unhandledRejection', (reason, p) => {
  console.error(reason, 'Unhandled Rejection at Promise', p);
  setTimeout(exit, 5000);
})
.on('uncaughtException', err => {
  console.error(err, 'Uncaught Exception thrown');
  setTimeout(exit, 5000);
});