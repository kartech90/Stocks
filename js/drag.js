let activeItem = null;
let startX, startY, initialLeft, initialTop;

function onStart(e) {
    const target = e.target.closest('.glow-wrapper');
    if (!target || target.classList.contains('drawer-ball')) return;
    activeItem = target;
    activeItem.classList.add('dragging');
    const t = e.type.includes('touch') ? e.touches[0] : e;
    startX = t.clientX;
    startY = t.clientY;
    initialLeft = parseFloat(activeItem.style.left);
    initialTop = parseFloat(activeItem.style.top);
}

function onMove(e) {
    if (!activeItem) return;
    const t = e.type.includes('touch') ? e.touches[0] : e;
    activeItem.style.left = `${initialLeft + (t.clientX - startX)}px`;
    activeItem.style.top = `${initialTop + (t.clientY - startY)}px`;

    const rect = activeItem.getBoundingClientRect();
    const bRect = board.getBoundingClientRect();
    const cx = (rect.left + rect.width / 2) - bRect.left;
    const cy = (rect.top + rect.height / 2) - bRect.top;

    let closestIdx = -1;
    let minD = activeItem.offsetWidth * 0.7;

    positions.forEach((pos, i) => {
        const d = Math.hypot(pos.x - cx, pos.y - cy);
        if (d < minD) {
            minD = d;
            closestIdx = i;
        }
    });

    const currIdx = currentOrder.indexOf(activeItem.dataset.symbol);
    if (closestIdx !== -1 && closestIdx !== currIdx) {
        [currentOrder[currIdx], currentOrder[closestIdx]] =
            [currentOrder[closestIdx], currentOrder[currIdx]];
        updateLayout();
    }
}

function onEnd() {
    if (activeItem) activeItem.classList.remove('dragging');
    activeItem = null;
    updateLayout();
}

document.addEventListener('mousedown', onStart);
document.addEventListener('mousemove', onMove);
document.addEventListener('mouseup', onEnd);
document.addEventListener('touchstart', onStart, { passive: false });
document.addEventListener('touchmove', onMove, { passive: false });
document.addEventListener('touchend', onEnd);