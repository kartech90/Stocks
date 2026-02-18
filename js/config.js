const LOGO_PATH = "assets/logos/";
const LOGO_EXT = ".png";

const STOCK_SYMBOLS = [
    "SHOP", "HOOD", "AAPL", "MSFT", "GOOG", "TSLA",
    "PYPL", "WMT", "BABA", "RIVN", "AMZN", "XIACY",
    "APP", "META", "NFLX", "SOFI", "NVDA", "SPY", "BTC"
];

const STOCKS = STOCK_SYMBOLS.map(s => [s, `${LOGO_PATH}${s}${LOGO_EXT}`]);

const BOARD_SIZE = 6;

const API_KEY = "d5qqfa1r01qhn30ha6k0d5qqfa1r01qhn30ha6kg";

