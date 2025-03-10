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

        tensRod.querySelectorAll('.bead').forEach(bead => {
            if (bead.classList.contains('active')) {
                tens += parseInt(bead.dataset.value);
            }
        });

        onesRod.querySelectorAll('.bead').forEach(bead => {
            if (bead.classList.contains('active')) {
                ones += parseInt(bead.dataset.value);
            }
        });

        return tens * 10 + ones;
    }

    function handleBeadClick(bead, rod) {
        const value = parseInt(bead.dataset.value);
        const isTensRod = rod.id === 'tens-rod';
        const previousValue = currentValue;

        if (isTensRod) {
            // Only one bead in tens rod (value 5)
            if (bead.classList.contains('active')) {
                bead.classList.remove('active');
            } else {
                rod.querySelectorAll('.bead').forEach(b => b.classList.remove('active'));
                bead.classList.add('active');
                onesRod.querySelectorAll('.bead').forEach(b => b.classList.remove('active')); // Clear ones
            }
        } else {
            // Ones rod logic
            rod.querySelectorAll('.bead').forEach(b => b.classList.remove('active'));
            if (value === 5) {
                bead.classList.add('active');
            } else {
                for (let i = 1; i <= value; i++) {
                    rod.querySelector(`.one-bead[data-value="${i}"]`).classList.add('active');
                }
            }
        }

        currentValue = calculateValue();
        if (currentValue > 10) currentValue = 10; // Cap at 10
        if (currentValue < 0) currentValue = 0; // Floor at 0

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
