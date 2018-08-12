
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
        name: 'Rinkeby Test Net',
        explorerUrl: 'https://rinkeby.etherscan.io/',
        providerUrl: 'https://rinkeby.infura.io/Q2aBIgYNhIB60VsqyrN1',
        contractAddress: '0x70d36a1383d69EF65be55ff439d3c90AC2f13e27',
        tokenContractAddress: '0xEFd3F89c5B88583a3AE87e5b0012BfE2BAEAD29E',
        userContractAddress: '0x3941de3060196e9cdD01f5e29741fFb01b316305',
        bidContractAddress: '0x928CC3393AaD7B0aCC6232Be0Ed386FD69498751',
        messagingContractAddress: '0x16999f0cc661A5e6C23702076A9fD462186e5640'
    }
]

module.exports.TOKEN_DECIMAL = 100000000; // 8 decimals

module.exports.ENV = {
    get ContractAddress() {
        return this.getProperty('contractAddress');
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
        console.log('current network: ' + network + '::' + localStorage.ethNetwork);
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