// Import
import { ApiPromise, WsProvider } from '@polkadot/api';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc'
// import config from './config.js'
const config = {
    "APP_NAME": "substrate-front-end-template",
    "CUSTOM_RPC_METHODS": {},
    "PROVIDER_SOCKET": "ws://127.0.0.1:9944"
  }
  

// Construct
const wsProvider = new WsProvider('ws://127.0.0.1:9944');
const api = await ApiPromise.create({ provider: wsProvider});

// Do something
console.log(api.genesisHash.toHex());

const num = await api.query.templateModule.something()

console.log(num.toString());
