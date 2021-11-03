import {cutil} from "@ghasemkiani/base";
import {Obj} from "@ghasemkiani/base";

class Util extends Obj {
	tok(tokenId) {
		return this.assets[tokenId];
	}
	token(aTokId) {
		return Object.entries(this.assets).find(([tokenId, tokId]) => (tokId === aTokId))[0];
	}
}
cutil.extend(Util.prototype, {
	ASSET_PRECISION: 8,
	assets: {
		"ADA": "ADA-9F4",
		"ANKR": "ANKR-E97",
		"ATOM": "ATOM-596",
		"AVA": "AVA-645",
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
		"BTT": "BTTB-D31",
		"BTTB": "BTTB-D31",
		"BULL": "BULL-BE4",
		"BURGER": "BURGER-33A",
		"BUSD": "BUSD-BD1",
		"CAKE": "CAKE-435",
		"CBM": "CBM-4B2",
		"CHZ": "CHZ-ECD",
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
		"FTM": "FTM-A64",
		"FTT": "FTT-F11",
		"INJ": "INJ-FAE",
		"IOTX": "IOTX-0ED",
		"LINK": "LINK-AAD",
		"LTC": "LTC-F07",
		"MATIC": "MATIC-84A",
		"MITH": "MITH-C76",
		"NEXO": "NEXO-A84",
		"NPXSXEM": "NPXSXEM-89C",
		"ONT": "ONT-33D",
		"PROPEL": "PROPEL-6D9",
		"RUNE": "RUNE-B1A",
		"SHR": "SHR-DB6",
		"SPARTA": "SPARTA-7F3",
		"SWINGBY": "SWINGBY-888",
		"SXP": "SXP-CCC",
		"TRX": "TRXB-2E6",
		"TRXB": "TRXB-2E6",
		"TUSD": "TUSDB-888",
		"TUSDB": "TUSDB-888",
		"TWT": "TWT-8C2",
		"UNI": "UNI-DD8",
		"USDC": "USDC-CD2",
		"USDS": "USDSB-1AC",
		"USDSB": "USDSB-1AC",
		"USDT": "USDT-6D8",
		"WIN": "WINB-41F",
		"WINB": "WINB-41F",
		"WRX": "WRX-ED1",
		"XRP": "XRP-BF2",
		"XRPBEAR": "XRPBEAR-00B",
		"XRPBULL": "XRPBULL-E7C",
		"XTZ": "XTZ-F7A",
		"XVS": "XVS-795",
		"YFI": "YFI-1A4",
		"YFII": "YFII-061",
		"ZEC": "ZEC-93E",
	},
});

const util = new Util();

export {Util, util};
