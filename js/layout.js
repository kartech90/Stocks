let positions = [];

function calcDrawerLayout() {
    const count = stockData.length;
    if (count === 0) return { size: 100, gap: 14, fontSize: 0.9 };

    const containerW = window.innerWidth;
    const containerH = window.innerHeight;
    const padX = 20;
    const padTop = 50;
    const padBottom = 90;
    const usableW = containerW - (padX * 2);
    const usableH = containerH - padTop - padBottom;
    const spacing = 14;

    let bestSize = 0;
    let bestCols = 1;
    let needsScroll = false;

    for (let cols = 1; cols <= Math.min(count, 10); cols++) {
        const rows = Math.ceil(count / cols);
        const sizeByW = (usableW - spacing * (cols + 1)) / cols;
        const sizeByH = (usableH - spacing * (rows + 1)) / rows;
        const fitSize = Math.floor(Math.min(sizeByW, sizeByH));

        if (fitSize > bestSize && fitSize > 20) {
            bestSize = fitSize;
            bestCols = cols;
            needsScroll = false;
        }
    }

    if (bestSize < 60) {
        for (let cols = 2; cols <= Math.min(count, 8); cols++) {
            const sizeByW = (usableW - spacing * (cols + 1)) / cols;
            if (sizeByW >= 60 && sizeByW <= 200) {
                bestSize = Math.floor(sizeByW);
                bestCols = cols;
                needsScroll = true;
                break;
            }
        }
        if (bestSize < 60) {
            bestCols = 3;
            bestSize = Math.floor((usableW - spacing * 4) / 3);
            needsScroll = true;
        }
    }

    const fontSize = Math.max(0.5, Math.min(1.1, bestSize / 110));

    return {
        size: bestSize,
        gap: spacing,
        fontSize: fontSize,
        needsScroll: needsScroll
    };
}

function updateLayout() {
    const rect = board.getBoundingClientRect();
    const padding = parseFloat(getComputedStyle(board).padding);
    const cellW = (rect.width - (padding * 2)) / 3;
    const cellH = (rect.height - (padding * 2)) / 2;
    const diameter = Math.min(cellW, cellH) * 0.85;
    const radius = diameter / 2;

    positions = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
        const row = Math.floor(i / 3);
        const col = i % 3;
        positions.push({
            x: padding + (col * cellW) + (cellW / 2),
            y: padding + (row * cellH) + (cellH / 2)
        });
    }

    currentOrder.forEach((symbol, index) => {
        const wrapper = boardElements[symbol];
        if (!wrapper) return;
        wrapper.style.width = `${diameter}px`;
        wrapper.style.height = `${diameter}px`;
        if (!wrapper.classList.contains('dragging')) {
            const pos = positions[index];
            wrapper.style.left = `${pos.x - radius}px`;
            wrapper.style.top = `${pos.y - radius}px`;
        }
    });
}