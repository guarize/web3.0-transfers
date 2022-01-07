require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/NsibKP_UaZePKVh2pXZ078u_ZQui52Ut',
      accounts: [
        'a3bc556d330701f56b148bc0e89d8f4faf3df32023b6663dbad7c9201dd269e0',
      ],
    },
  },
};
