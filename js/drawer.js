function openDrawer() {
    drawer.classList.add('open');
}

function closeDrawer() {
    drawer.classList.remove('open');
}

btnOpenDrawer.addEventListener('click', openDrawer);
btnCloseDrawer.addEventListener('click', closeDrawer);
btnSort.addEventListener('click', toggleSort);
btnSortDrawer.addEventListener('click', toggleSort);

let touchStartY = 0;

document.addEventListener('touchstart', function (e) {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', function (e) {
    const deltaY = touchStartY - e.changedTouches[0].clientY;
    if (deltaY > 50 && touchStartY > window.innerHeight * 0.75) openDrawer();
    if (deltaY < -50 && drawer.classList.contains('open')) closeDrawer();
}, { passive: true });