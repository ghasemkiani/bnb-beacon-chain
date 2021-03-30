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
		"ANKR": "ANKR-E97",
		"ATOM": "ATOM-596",
		"AWC": "AWC-986",
		"BAKE": "BAKE-5E0",
		"BAND": "BAND-34B",
		"BCH": "BCH-1FD",
		"BCHA": "BCHA-959",
		"BEAR": "BEAR-14C",
		"BIFI": "BIFI-290",
		"BNB": "BNB",
		"BTC": "BTCB-1DE",
		"BTCB": "BTCB-1DE",
		"BTTB": "BTTB-D31",
		"BULL": "BULL-BE4",
		"BURGER": "BURGER-33A",
		"BUSD": "BUSD-BD1",
		"CAKE": "CAKE-435",
		"COMP": "COMP-DEE",
		"CTK": "CTK-EB8",
		"DAI": "DAI-D75",
		"DOGE": "DOGE-B67",
		"DOT": "DOT-64C",
		"EOS": "EOS-CDD",
		"EOSBEAR": "EOSBEAR-721",
		"EOSBULL": "EOSBULL-F0D",
		"ETH": "ETH-1C9",
		"ETHBEAR": "ETHBEAR-B2B",
		"ETHBULL": "ETHBULL-D33",
		"FIL": "FIL-E2C",
		"FSN": "FSN-E14",
		"FTT": "FTT-F11",
		"INJ": "INJ-FAE",
		"IOTX": "IOTX-0ED",
		"LINK": "LINK-AAD",
		"LTC": "LTC-F07",
		"PROPEL": "PROPEL-6D9",
		"RUNE": "RUNE-B1A",
		"SPARTA": "SPARTA-7F3",
		"SWINGBY": "SWINGBY-888",
		"SXP": "SXP-CCC",
		"TRXB": "TRXB-2E6",
		"TUSDB": "TUSDB-888",
		"TWT": "TWT-8C2",
		"UNI": "UNI-DD8",
		"USDC": "USDC-CD2",
		"USDT": "USDT-6D8",
		"WRX": "WRX-ED1",
		"XRP": "XRP-BF2",
		"XRPBEAR": "XRPBEAR-00B",
		"XRPBULL": "XRPBULL-E7C",
		"XTZ": "XTZ-F7A",
		"XVS": "XVS-795",
		"YFI": "YFI-1A4",
		"YFII": "YFII-061",
	},
});

const util = new Util();

module.exports = {Util, util};
