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

        const tensHeaven = tensRod.querySelector('.heaven-bead');
        if (tensHeaven.classList.contains('active')) tens += 5;
        tensRod.querySelectorAll('.earth-bead').forEach(bead => {
            if (bead.classList.contains('active')) tens += 1;
        });

        const onesHeaven = onesRod.querySelector('.heaven-bead');
        if (onesHeaven.classList.contains('active')) ones += 5;
        onesRod.querySelectorAll('.earth-bead').forEach(bead => {
            if (bead.classList.contains('active')) ones += 1;
        });

        return tens * 10 + ones;
    }

    function handleBeadClick(bead, rod) {
        const isHeaven = bead.classList.contains('heaven-bead');
        const isTensRod = rod.id === 'tens-rod';
        const previousValue = currentValue;

        if (isTensRod) {
            if (isHeaven) {
                const wasActive = bead.classList.contains('active');
                rod.querySelectorAll('.bead').forEach(b => b.classList.remove('active'));
                if (!wasActive) bead.classList.add('active');
                onesRod.querySelectorAll('.bead').forEach(b => b.classList.remove('active')); // Clear ones
            } else {
                // Earth beads in tens rod (not used for 0-10, but included for completeness)
                const earthBeads = rod.querySelectorAll('.earth-bead');
                const index = Array.from(earthBeads).indexOf(bead) + 1;
                rod.querySelectorAll('.bead').forEach(b => b.classList.remove('active'));
                for (let i = 0; i < index; i++) {
                    earthBeads[i].classList.add('active');
                }
            }
        } else { // Ones rod
            if (isHeaven) {
                rod.querySelectorAll('.bead').forEach(b => b.classList.remove('active'));
                bead.classList.add('active');
            } else {
                const earthBeads = rod.querySelectorAll('.earth-bead');
                const index = Array.from(earthBeads).indexOf(bead) + 1;
                rod.querySelectorAll('.bead').forEach(b => b.classList.remove('active'));
                for (let i = 0; i < index; i++) {
                    earthBeads[i].classList.add('active');
                }
            }
        }

        currentValue = calculateValue();
        if (currentValue > 10) {
            resetSoroban();
            currentValue = 10;
            onesRod.querySelector('.heaven-bead').classList.add('active');
            onesRod.querySelectorAll('.earth-bead')[0].classList.add('active');
        }
        if (currentValue < 0) currentValue = 0;

        const diff = currentValue - previousValue;
        if (diff !== 0) {
            lastOperation = `${previousValue} ${diff > 0 ? '+' : '-'} ${Math.abs(diff)} = ${currentValue}`;
            operationLog.textContent = lastOperation;
        }
        updateDisplay();
    }

    document.querySelectorAll('.bead').forEach(bead => {
        bead.addEventListener('click', () => {
            handleBeadClick(bead, bead.parentElement);
        });
    });

    resetBtn.addEventListener('click', resetSoroban);

    resetSoroban(); // Initial state
});
