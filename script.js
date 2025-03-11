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
        } else {
            onesRod.querySelectorAll('.earth-bead').forEach(bead => {
                if (bead.classList.contains('active')) ones += 1;
            });
        }

        return tens + ones;
    }

    function handleBeadClick(bead, rod) {
        const isHeaven = bead.classList.contains('heaven-bead');
        const isTensRod = rod.id === 'tens-rod');
        const previousValue = currentValue;

        if (isTensRod) {
            if (!isHeaven) {
                // Only the first earth bead in tens rod moves up for 10
                const earthBeads = rod.querySelectorAll('.earth-bead');
                const firstBead = earthBeads[0];
                if (bead === firstBead) {
                    bead.classList.toggle('active');
                    if (bead.classList.contains('active')) {
                        onesRod.querySelectorAll('.bead').forEach(b => b.classList.remove('active')); // Clear ones
                    }
                }
            }
            // Heaven bead in tens rod does nothing (stays at frame)
        } else { // Ones rod
            if (isHeaven) {
                // Toggle heaven bead, clear earth beads
                bead.classList.toggle('active');
                if (bead.classList.contains('active')) {
                    rod.querySelectorAll('.earth-bead').forEach(b => b.classList.remove('active'));
                }
            } else {
                // Toggle individual earth beads
                bead.classList.toggle('active');
                // If heaven bead is active and an earth bead is clicked, deactivate heaven
                const heavenBead = rod.querySelector('.heaven-bead');
                if (heavenBead.classList.contains('active')) {
                    heavenBead.classList.remove('active');
                }
            }
        }

        currentValue = calculateValue();
        if (currentValue > 10) {
            resetSoroban();
            currentValue = 10;
            tensRod.querySelector('.earth-bead[data-value="10"]').classList.add('active');
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
