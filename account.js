import {bech32} from "bech32";
import {BncClient, rpc as RpcClient, crypto} from "@binance-chain/javascript-sdk";

import {cutil} from "@ghasemkiani/base";
import {Obj} from "@ghasemkiani/base";
import {HDWallet} from "@ghasemkiani/hdwallet";

import {util as utilBc} from "./util.js";

class Account extends Obj {
	get bncClient() {
		if(!this._bncClient) {
			this._bncClient = new BncClient(this.bncUrl);
			this._bncClient.chooseNetwork(this.network);
		}
		return this._bncClient;
	}
	set bncClient(bncClient) {
		this._bncClient = bncClient;
	}
	get rpcClient() {
		if(!this._rpcClient) {
			this._rpcClient = new RpcClient(this.rpcUrl, this.network);
		}
		return this._rpcClient;
	}
	set rpcClient(rpcClient) {
		this._rpcClient = rpcClient;
	}
	get key() {
		if(cutil.isNilOrEmptyString(this._key)) {
			if(!cutil.isNilOrEmptyString(this.mnemonic)) {
				let hdwallet = new HDWallet();
				this._key = hdwallet.getPrivateKeyFromMnemonic(this.mnemonic, hdwallet.HDPATH_BINANCE_CHAIN);
			}
		}
		return this._key;
	}
	set key(key) {
		this._key = key;
	}
	get address() {
		if(!this._address) {
			let prefix = /^mainnet$/.test(this.network) ? "bnb" : "tbnb";
			this._address = crypto.getAddressFromPrivateKey(this.key, prefix);
			// this._address = this.bncClient.getClientKeyAddress();
		}
		return this._address;
	}
	set address(address) {
		this._address = address;
	}
	get addressEth() {
		let addressEth = this.address;
		if(!cutil.isNilOrEmptyString(addressEth)) {
			let bytes = bech32.fromWords(bech32.decode(addressEth).words);
			addressEth = `0x${Buffer.from(bytes).toString("hex")}`;
		}
		return addressEth;
	}
	set addressEth(addressEth) {
		let address = null;
		if(!cutil.isNilOrEmptyString(addressEth)) {
			let words = bech32.toWords(Buffer.from(addressEth.substring(2), "hex"));
			address = bech32.encode(/mainnet/i.test(this.network) ? "bnb" : "tbnb", words);
		}
		this.address = address;
	}
	async toUpdateKey() {
		if(this.key) {
			await this.bncClient.setPrivateKey(this.key);
		}
	}
	async toInit() {
		await this.bncClient.initChain();
		await this.toUpdateKey();
	}
	async toGetBalances() {
		let account = this;
		let {address} = account;
		let response = await account.bncClient.getAccount(address);
		if(response.status !== 200) {
			throw new Error(`Failed to get account for address: ${address}`);
		}
		account._account = response.result;
		account.balances = {};
		for(let item of account._account.balances) {
			let asset = item.symbol;
			let obj = account.balances[asset] = {total: 0};
			for(let k of ["free", "frozen", "locked"]) {
				obj.total += obj[k] = Number(item[k]);
			}
		}
	}
	bal(tokId) {
		let account = this;
		if (cutil.isNil(account.balances)) {
			return null;
		}
		if (tokId.indexOf("-") < 0) {
			tokId = utilBc.tok(tokId);
		}
		return account.balances[tokId]?.total || 0;
	}
}
cutil.extend(Account.prototype, {
	network: "mainnet",
	apiUrl: "https://dex.binance.org",
	bncUrl: "https://dex.binance.org",
	rpcUrl: "https://dataseed1.ninicoin.io",
	_bncClient: null,
	_rpcClient: null,
	mnemonic: null,
	_key: null,
	_address: null,
	_account: null,
	balances: null,
});

export {Account};
