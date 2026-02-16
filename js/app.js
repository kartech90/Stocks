window.addEventListener('resize', function () {
    renderAll();
    updateLayout();
});

setTimeout(function () {
    renderAll();
    updateLayout();
    updatePercent();
}, 100);

setInterval(updatePercent, 120000);