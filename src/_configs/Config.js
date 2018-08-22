
module.exports.NETWORK_LIST = [
    {
        id: 1,
        name: 'Main Network',
        contractAddress: '0x163485b3cddc7b3202e56ad31fb1921a00759f21',
        explorerUrl: 'https://etherscan.io/',
        providerUrl: 'https://mainnet.infura.io/Q2aBIgYNhIB60VsqyrN1'
    },
    {
        id: 4,
        name: 'Rinkeby Test Network',
        explorerUrl: 'https://rinkeby.etherscan.io/',
        providerUrl: 'https://rinkeby.infura.io/Q2aBIgYNhIB60VsqyrN1',
        contractAddress: '0xbE233C4bc5C4e4f0c9C7D2B1908047dC51F98748',
        tokenContractAddress: '0x9c2fA57F790e14dD686146CC4cdAfB4e87d90F2B',
        userContractAddress: '0xa089E99E3FcDc262Ad681323DCCA4f48597412bF',
        bidContractAddress: '0xbaAD71bDaF021C5dc39e4dBb800232c914e99860',
        messagingContractAddress: '0x8fA42019F82b8E2815D488B1cE9d75A8d89c945c',
        apiHost: 'http://poc.polyalpha.io'
    }
]

module.exports.TOKEN_DECIMAL = 100000000; // 8 decimals
module.exports.TOKEN_SYMBOL = 'PADT';
module.exports.TOKEN_NAME = 'PolyAlpha Demo token';

module.exports.ENV = {
    get ContractAddress() {
        return this.getProperty('contractAddress');
    },

    get ApiHost() {
        return this.getProperty('apiHost');
    },

    get TokenContractAddress() {
        return this.getProperty('tokenContractAddress');
    },

    get UserContractAddress() {
        return this.getProperty('userContractAddress');
    },

    get BidContractAddress() {
        return this.getProperty('bidContractAddress');
    },

    get MessagingContractAddress() {
        return this.getProperty('messagingContractAddress');
    },

    get NetworkName() {
        return this.getProperty('name');
    },

    get ProviderUrl() {
        return this.getProperty('providerUrl');
    },

    get ExplorerUrl() {
        return this.getProperty('explorerUrl');
    },

    getProperty(propertyName) {
        var network = this.EthNetworkId;
        // console.log('current network: ' + network + '::' + localStorage.ethNetwork);
        for (var i=0;i<module.exports.NETWORK_LIST.length;i++) {
            if (network == module.exports.NETWORK_LIST[i].id) {
                return module.exports.NETWORK_LIST[i][propertyName];
            }
        }
        // if (typeof(Storage) !== 'undefined' && localStorage.ethNetwork != undefined) {
            
            
        // } else {
        //     // return "";
        //     return module.exports.NETWORK_LIST[0][propertyName];
        // }
    },

    set EthNetworkId(networkId) {
        if (typeof(Storage) != 'undefined') {
            localStorage.setItem('ethNetwork', networkId);
        }
    },

    get EthNetworkId() {
        if (typeof(Storage) !== 'undefined' || localStorage.ethNetwork == undefined) {
            return parseInt(localStorage.ethNetwork);
        } else {
            return 0;
        }
    }
}