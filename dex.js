//	@ghasemkiani/binance-chain/dex

const fetch = require("isomorphic-fetch");

const BncClient = require("@binance-chain/javascript-sdk");
const {rpc: RpcClient, crypto} = BncClient;

const {Base} = require("@ghasemkiani/commonbase/base");
const {Inputter} = require("@ghasemkiani/commonbase/sys/inputter");
const {quantity: quant} = require("@ghasemkiani/commonbase/util/quantity");
const {cutil} = require("@ghasemkiani/commonbase/cutil");

class Dex extends Base {
	static SIDE = {BUY: 1, SELL: 2};
	static TIMEINFORCE = {GTC: 1, IOC: 3};
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
	async toInit() {
		await this.bncClient.initChain();
		if(this.privateKey) {
			await this.bncClient.setPrivateKey(this.privateKey);
		}
	}
	async toSetPrivateKey(privateKey) {
		this._address = null;
		this.privateKey = privateKey;
		await this.bncClient.setPrivateKey(this.privateKey);
	}
	get address() {
		if(!this._address) {
			this._address = this.bncClient.getClientKeyAddress();
		}
		return this._address;
	}
	set address(address) {
		this._address = address;
	}
	async toGetAccount() {
		let response = await this.bncClient.getAccount(this.address);
		if(response.status !== 200) {
			throw new Error(`Failed to get account for address: ${this.address}`);
		}
		this.account = response.result;
		this.balances = {};
		for(let item of this.account.balances) {
			let asset = item.symbol;
			let obj = this.balances[asset] = {};
			for(let k of Object.keys(item)) {
				obj[k] = Number(item[k]);
			}
		}
	}
	async toPlaceOrder({symbol, side, price, quantity, stat}) {
		let address = this.address;
		if(cutil.isString(side)) {
			side = Dex.SIDE[side.toUpperCase()];
		}
		// let timeinforce = !!stat ? Dex.TIMEINFORCE.IOC : Dex.TIMEINFORCE.GTC;
		// let sequence = this.account ? this.account.sequence || 0 : 0;
		// let result = await this.bncClient.placeOrder(address, symbol, side, price, quantity, sequence, timeinforce);
		let result = await this.bncClient.placeOrder(address, symbol, side, price, quantity);
		return result;
	}
	async toBuy(arg) {
		arg.side = "buy";
		return await this.toPlaceOrder(arg);
	}
	async toSell(arg) {
		arg.side = "sell";
		return await this.toPlaceOrder(arg);
	}
	async toCreateAccount({password}) {
		let account = await this.bncClient.createAccountWithMneomnic();
		let privateKeyHex = account.privateKey;
		account.keystore = crypto.generateKeyStore(privateKeyHex, password);
		account.password = password;
		return account;
	}
	async toCreateAccountAndSaveToPass({password, id, pass}) {
		let account = await this.toCreateAccount({password});
		pass.set(`binance.org/${id}/mnemonic`, account.mnemonic);
		pass.set(`binance.org/${id}/password`, account.password);
		pass.jset(`binance.org/${id}/keystore`, account.keystore);
		pass.set(`binance.org/${id}/privateKey`, account.privateKey);
		pass.set(`binance.org/${id}/address`, account.address);
	}
	async toTransfer({address, amount, asset, memo}) {
		let fromAddress = this.address;
		let toAddress = address;
		// let sequence = this.account ? this.account.sequence || 0 : 0;
		// let result = await this.bncClient.transfer(fromAddress, toAddress, amount, asset, memo, sequence);
		let result = await this.bncClient.transfer(fromAddress, toAddress, amount, asset, memo);
		return result;
	}
	async toGetOpenOrders({symbol}) {
		let address = this.address;
		let openOrders = await this.rpcClient.getOpenOrders(address, symbol);
		return openOrders;
	}
	async toCancelAllOrders({symbol}) {
		let address = this.address;
		let openOrders = await this.rpcClient.getOpenOrders(address, symbol);
		console.log(`openOrders: ${openOrders.length}`);
		console.log(`openOrders: ${JSON.stringify(openOrders)}`);
		let results = [];
		let fromAddress = address;
		for(let order of openOrders) {
			if(order.quantity !== 5011) {
				let refid = order.id;
				await this.toGetAccount();
				let sequence = this.account ? this.account.sequence || 0 : 0;
				let result = await this.bncClient.cancelOrder(fromAddress, symbol, refid, sequence);
				// let result = await this.bncClient.cancelOrder(fromAddress, symbol, refid);
				results.push(result);
				await quant.time("3s").toSchedule();
			}
		}
		return results;
	}
}
cutil.extend(Dex.prototype, {
	network: "mainnet",
	bncUrl: "https://dex.binance.org/",
	rpcUrl: "https://seed1.longevito.io:443",
	rpcUrl: "https://dataseed1.ninicoin.io:443",
	_bncClient: null,
	_rpcClient: null,
	privateKey: null,
	_address: null,
	account: null,
	balances: null,
});
