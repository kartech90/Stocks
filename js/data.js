const originalOrder = STOCKS.map(([symbol, logo]) => ({
    symbol,
    logo,
    percent: null,
    data: null
}));

let stockData = originalOrder.map(s => ({ ...s }));
let isSorted = false;

async function updatePercent() {
    for (const stock of stockData) {
        try {
            const res = await fetch(
                `https://finnhub.io/api/v1/quote?symbol=${stock.symbol}&token=${API_KEY}`
            );
            const data = await res.json();
            stock.percent = data.dp || 0;
            stock.data = data;

            const orig = originalOrder.find(o => o.symbol === stock.symbol);
            if (orig) {
                orig.percent = stock.percent;
                orig.data = stock.data;
            }

            applyStock(stock);
            await new Promise(r => setTimeout(r, 100));
        } catch (e) {
            console.error(e);
        }
    }
}

function toggleSort() {
    isSorted = !isSorted;

    if (isSorted) {
        stockData.sort((a, b) => {
            const pa = a.percent !== null ? a.percent : -Infinity;
            const pb = b.percent !== null ? b.percent : -Infinity;
            return pb - pa;
        });
    } else {
        stockData = originalOrder.map(orig => {
            const current = stockData.find(s => s.symbol === orig.symbol);
            return {
                ...orig,
                percent: current?.percent ?? orig.percent,
                data: current?.data ?? orig.data
            };
        });
    }

    updateSortButtonStates();
    renderAll();
    updateLayout();
}

function updateSortButtonStates() {
    btnSort.classList.toggle('active', isSorted);
    btnSortDrawer.classList.toggle('active', isSorted);
}