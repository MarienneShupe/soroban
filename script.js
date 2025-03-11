document.addEventListener('DOMContentLoaded', () => {
    const tensRod = document.getElementById('tens-rod');
    const onesRod = document.getElementById('ones-rod');
    const display = document.getElementById('display');
    const operationLog = document.getElementById('operation-log');
    const resetBtn = document.getElementById('reset-btn');
    let currentValue = 0;
    let lastOperation = '';

    function updateDisplay() {
        display.textContent = currentValue;
    }

    function resetSoroban() {
        document.querySelectorAll('.bead').forEach(bead => bead.classList.remove('active'));
        currentValue = 0;
        updateDisplay();
        operationLog.textContent = '';
    }

    function calculateValue() {
        let tens = 0;
        let ones = 0;

        tensRod.querySelectorAll('.earth-bead').forEach(bead => {
            if (bead.classList.contains('active')) tens += parseInt(bead.dataset.value);
        });

        const onesHeaven = onesRod.querySelector('.heaven-bead');
        if (onesHeaven.classList.contains('active')) {
            ones = 5;
            onesRod.querySelectorAll('.earth-bead').forEach(bead => {
                if (bead.classList.contains('active')) ones += 1;
            });
        } else {
            onesRod.querySelectorAll('.earth-bead').forEach(bead => {
                if (bead.classList.contains('active')) ones += 1;
            });
        }

        return tens + ones;
    }

    function handleBeadClick(bead, rod) {
        const isHeaven = bead.classList.contains('heaven-bead');
        const isTensRod = rod.id === 'tens-rod';
        const previousValue = currentValue;

        if (isTensRod) {
            if (!isHeaven && !bead.classList.contains('static')) {
                const earthBeads = rod.querySelectorAll('.earth-bead');
                const firstBead = earthBeads[0];
                if (bead === firstBead && currentValue < 10) {
                    bead.classList.add('active');
                    onesRod.querySelectorAll('.bead').forEach(b => b.classList.remove('active'));
                }
            }
        } else { // Ones rod
            const earthBeads = rod.querySelectorAll('.earth-bead');
            const heavenBead = rod.querySelector('.heaven-bead');
            const activeEarthCount = Array.from(earthBeads).filter(b => b.classList.contains('active')).length;

            if (isHeaven && currentValue === 4) {
                bead.classList.add('active');
                earthBeads.forEach(b => b.classList.remove('active'));
            } else if (!isHeaven && currentValue < 4) {
                const index = Array.from(earthBeads).indexOf(bead);
                earthBeads.forEach((b, i) => {
                    if (i <= index) b.classList.add('active');
                    else b.classList.remove('active');
                });
            } else if (!isHeaven && currentValue >= 5 && currentValue < 9) {
                const index = Array.from(earthBeads).indexOf(bead);
                earthBeads.forEach((b, i) => {
                    if (i <= index) b.classList.add('active');
                    else b.classList.remove('active');
                });
            }
        }

        currentValue = calculateValue();
        if (currentValue > 10) {
            resetSoroban();
            currentValue = 10;
            tensRod.querySelector('.earth-bead[data-value="10"]').classList.add('active');
        }

        if (currentValue > previousValue) {
            lastOperation = `${previousValue} + ${currentValue - previousValue} = ${currentValue}`;
            operationLog.textContent = lastOperation;
        }
        updateDisplay();
    }

    document.querySelectorAll('.bead:not(.static)').forEach(bead => {
        bead.addEventListener('click', () => {
            handleBeadClick(bead, bead.parentElement);
        });
    });

    resetBtn.addEventListener('click', resetSoroban);

    resetSoroban(); // Initial state
});
