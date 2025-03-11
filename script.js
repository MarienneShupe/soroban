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

        if (tensRod.querySelector('.heaven-bead').classList.contains('active')) {
            tens = 5;
        }

        const onesHeaven = onesRod.querySelector('.heaven-bead');
        if (onesHeaven.classList.contains('active')) {
            ones = 5;
        } else {
            onesRod.querySelectorAll('.earth-bead').forEach(bead => {
                if (bead.classList.contains('active')) ones += 1;
            });
        }

        return tens + ones; // Tens is 0 or 5, ones is 0-9, max 10
    }

    function handleBeadClick(bead, rod) {
        const isHeaven = bead.classList.contains('heaven-bead');
        const isTensRod = rod.id === 'tens-rod';
        const previousValue = currentValue;

        if (isTensRod) {
            // Toggle tens heaven bead (5)
            bead.classList.toggle('active');
            if (bead.classList.contains('active')) {
                onesRod.querySelectorAll('.bead').forEach(b => b.classList.remove('active')); // Clear ones
            }
        } else { // Ones rod
            if (isHeaven) {
                // Set to 5, clear earth beads
                rod.querySelectorAll('.earth-bead').forEach(b => b.classList.remove('active'));
                bead.classList.toggle('active');
            } else {
                // Earth beads: set 1-4
                const earthBeads = rod.querySelectorAll('.earth-bead');
                const index = Array.from(earthBeads).indexOf(bead) + 1;
                rod.querySelector('.heaven-bead').classList.remove('active');
                earthBeads.forEach(b => b.classList.remove('active'));
                for (let i = 0; i < index; i++) {
                    earthBeads[i].classList.add('active');
                }
            }
        }

        currentValue = calculateValue();
        if (currentValue > 10) {
            resetSoroban();
            currentValue = 10;
            tensRod.querySelector('.heaven-bead').classList.add('active');
            onesRod.querySelector('.heaven-bead').classList.add('active');
        }

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
