const {cutil} = require("@ghasemkiani/commonbase/cutil");
const {Base} = require("@ghasemkiani/commonbase/base");

class Util extends Base {
	tok(tokenId) {
		return this.assets[tokenId];
	}
	token(aTokId) {
		return Object.entries(this.assets).find(([tokenId, tokId]) => (tokId === aTokId))[0];
	}
}
cutil.extend(Util.prototype, {
	assets: {
		"ADA": "ADA-9F4",
		"AWC": "AWC-986",
		"BCH": "BCH-1FD",
		"BCHA": "BCHA-959",
		"BEAR": "BEAR-14C",
		"BNB": "BNB",
		"BTC": "BTCB-1DE",
		"BTCB": "BTCB-1DE",
		"BTTB": "BTTB-D31",
		"BULL": "BULL-BE4",
		"BUSD": "BUSD-BD1",
		"DAI": "DAI-D75",
		"DOGE": "DOGE-B67",
		"DOT": "DOT-64C",
		"EOS": "EOS-CDD",
		"EOSBEAR": "EOSBEAR-721",
		"EOSBULL": "EOSBULL-F0D",
		"ETH": "ETH-1C9",
		"ETHBEAR": "ETHBEAR-B2B",
		"ETHBULL": "ETHBULL-D33",
		"FSN": "FSN-E14",
		"FTT": "FTT-F11",
		"LTC": "LTC-F07",
		"RUNE": "RUNE-B1A",
		"SWINGBY": "SWINGBY-888",
		"TRXB": "TRXB-2E6",
		"TUSDB": "TUSDB-888",
		"TWT": "TWT-8C2",
		"USDT": "USDT-6D8",
		"WRX": "WRX-ED1",
		"XRP": "XRP-BF2",
		"XRPBEAR": "XRPBEAR-00B",
		"XRPBULL": "XRPBULL-E7C",
	},
});

const util = new Util();

module.exports = {Util, util};
