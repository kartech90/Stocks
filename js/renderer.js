let boardElements = {};
let drawerElements = {};
let currentOrder = [];

function createBallHTML(stock) {
    return `
        <div class="glow-effect"></div>
        <div class="circle">
            <div class="wave-container"><div class="wave"></div></div>
            <div class="logo"><img src="${stock.logo}" alt="${stock.symbol}"></div>
            <div class="percent">--%</div>
        </div>
    `;
}

function applyDataToElement(el, stock) {
    if (!el || stock.percent === null) return;
    const p = stock.percent;
    const color = p >= 0 ? "#00ff88" : "#ff3344";

    el.querySelector(".percent").textContent = (p >= 0 ? "+" : "") + p.toFixed(2) + "%";
    el.querySelector(".percent").style.color = color;

    const level = Math.min(Math.abs(p), 10);
    el.querySelector(".wave-container").style.top = `${105 - (level * 11)}%`;
    el.querySelector(".wave").style.backgroundColor = color;
    el.querySelector(".circle").style.borderColor = color;
    el.style.setProperty('--glow-color', color);
    el.querySelector(".glow-effect").style.boxShadow = `0 0 40px 10px ${color}`;
}

function applyStock(stock) {
    applyDataToElement(boardElements[stock.symbol], stock);
    applyDataToElement(drawerElements[stock.symbol], stock);
}

function renderAll() {
    board.innerHTML = '';
    drawerContent.innerHTML = '';
    boardElements = {};
    drawerElements = {};
    currentOrder = [];

    const layout = calcDrawerLayout();

    if (layout.needsScroll) {
        drawerContent.classList.add('has-scroll');
    } else {
        drawerContent.classList.remove('has-scroll');
    }

    drawerContent.style.gap = `${layout.gap}px`;

    stockData.forEach((stock, i) => {
        if (i < BOARD_SIZE) {
            const boardEl = document.createElement('div');
            boardEl.className = 'glow-wrapper';
            boardEl.dataset.symbol = stock.symbol;
            boardEl.innerHTML = createBallHTML(stock);
            board.appendChild(boardEl);
            boardElements[stock.symbol] = boardEl;
            currentOrder.push(stock.symbol);
        }

        const drawerEl = document.createElement('div');
        drawerEl.className = 'glow-wrapper drawer-ball';
        drawerEl.dataset.symbol = stock.symbol;
        drawerEl.style.position = 'relative';
        drawerEl.style.left = '0';
        drawerEl.style.top = '0';
        drawerEl.style.width = `${layout.size}px`;
        drawerEl.style.height = `${layout.size}px`;
        drawerEl.style.margin = `${layout.gap / 2}px`;
        drawerEl.innerHTML = createBallHTML(stock);

        const percentEl = drawerEl.querySelector('.percent');
        if (percentEl) percentEl.style.fontSize = `${layout.fontSize}rem`;

        const glowEl = drawerEl.querySelector('.glow-effect');
        if (glowEl) {
            const blurAmt = Math.max(3, Math.floor(layout.size / 15));
            glowEl.style.filter = `blur(${blurAmt}px)`;
        }

        drawerContent.appendChild(drawerEl);
        drawerElements[stock.symbol] = drawerEl;

        applyStock(stock);
    });
}