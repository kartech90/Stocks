let positions = [];

function calcDrawerLayout() {
    const count = stockData.length;
    if (count === 0) return { size: 100, gap: 20, fontSize: 0.9 };

    const containerW = window.innerWidth;
    const containerH = window.innerHeight;
    const padX = 20;
    const padTop = 50;
    const padBottom = 90;
    const usableW = containerW - (padX * 2);
    const usableH = containerH - padTop - padBottom;

    const minGap = 20;
    const maxGap = 32;

    let bestSize = 0;
    let bestCols = 1;
    let bestGap = minGap;

    for (let cols = 1; cols <= Math.min(count, 12); cols++) {
        const rows = Math.ceil(count / cols);

        for (let gap = maxGap; gap >= minGap; gap -= 2) {
            const availW = usableW - gap * (cols + 1);
            const availH = usableH - gap * (rows + 1);

            if (availW <= 0 || availH <= 0) continue;

            const sizeByW = Math.floor(availW / cols);
            const sizeByH = Math.floor(availH / rows);
            const fitSize = Math.min(sizeByW, sizeByH);

            if (fitSize > bestSize && fitSize >= 20) {
                bestSize = fitSize;
                bestCols = cols;
                bestGap = gap;
            }
        }
    }

    if (bestSize < 30) {
        bestCols = Math.ceil(Math.sqrt(count));
        const rows = Math.ceil(count / bestCols);
        bestGap = minGap;
        const availW = usableW - bestGap * (bestCols + 1);
        const availH = usableH - bestGap * (rows + 1);
        bestSize = Math.max(20, Math.floor(Math.min(availW / bestCols, availH / rows)));
    }

    const fontSize = Math.max(0.4, Math.min(1.1, bestSize / 110));

    return {
        size: bestSize,
        gap: bestGap,
        fontSize: fontSize,
        cols: bestCols,
        needsScroll: false
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
