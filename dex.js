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
	network = "mainnet";
	apiUrl = "https://dex.binance.org";
	bncUrl = "https://dex.binance.org";
	// rpcUrl = "https://seed1.longevito.io:443";
	rpcUrl = "https://dataseed1.ninicoin.io:443";
	_bncClient = null;
	_rpcClient = null;
	privateKey = null;
	_address = null;
	account = null;
	balances = null;
	
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
	dateStr(date) {
		return date.toISOString();
	}
	strDate(str) {
		return new Date(str);
	}
	async toGetTrades(start = new Date("2016-01-01"), end = new Date(), trades) {
		const MAX_LIMIT = 1000;
		trades = trades || {};
		let address = this.address;
		let url = `https://dex.binance.org/api/v1/orders/closed?address=${address}&limit=${MAX_LIMIT}&start=${start.getTime()}&end=${end.getTime()}`;
		// console.log(url);
		let rsp = await fetch(url);
		let json = await rsp.json();
		let orders = json.order;
		if(orders) {
			let date = end;
			for(let {status, transactionTime, symbol, price, side, cumulateQuantity} of orders) {
				date = this.strDate(transactionTime);
				if(((status === "FullyFill") || (status === "PartialFill")) && (date >= start) && (date < end)) {
					let [baseAsset, quoteAsset] = symbol.split("_");
					let market = symbol in trades ? trades[symbol] : (trades[symbol] = {symbol, baseAsset, quoteAsset, buy: {n: 0, base: 0, quote: 0, price: 0}, sell: {n: 0, base: 0, quote: 0, price: 0}});
					let base = Number(cumulateQuantity);
					let quote = base * Number(price);
					let data = market[(side === Dex.SIDE.BUY) ? "buy" : "sell"];
					data.n++;
					data.base += base;
					data.quote += quote;
					data.price = data.quote / data.base;
				}
			}
			if(orders.length === MAX_LIMIT && date > start) {
				await this.toGetTrades(start, date, trades);
			}
		}
		return trades;
	}
	async toCallApi(path, params) {
		let url = `${this.apiUrl}${path}`;
		let entries = Object.entries(Object(params));
		if(entries.length > 0) {
			url += "?" + entries.map(bi => bi.map(encodeURIComponent).join("=")).join("&");
		}
		// console.log(url);
		let rsp = await fetch(url);
		let json = await rsp.json();
		return json;
	}
	
	#oMarkets = null;
	get oMarkets() {
		if(!this.#oMarkets) {
			this.#oMarkets = {};
		}
		return this.#oMarkets;
	}
	set oMarkets(oMarkets) {
		this.#oMarkets = oMarkets;
	}
	get markets() {
		return Object.values(this.oMarkets);
	}
	async toGetMarketInfos() {
		this.oMarkets = null;
		let infos = await this.toCallApi("/api/v1/markets", {offset: 0, limit: 1000});
		for(let info of infos) {
			info.symbol = info.base_asset_symbol + "_" + info.quote_asset_symbol;
			this.oMarkets[info.symbol] = {info};
		}
	}
	async toGetMarketTickers() {
		let tickers = await this.toCallApi("/api/v1/ticker/24hr");
		// console.log(`this.oMarkets: ${JSON.stringify(this.oMarkets)}`);
		for(let ticker of tickers) {
			// console.log(`ticker.symbol: ${ticker.symbol}`);
			this.oMarkets[ticker.symbol].ticker = ticker;
		}
	}
}

module.exports = {Dex};
