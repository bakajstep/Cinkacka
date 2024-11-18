// Kontrola podpory service workeru
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(registration => {
          console.log('Service Worker registrován s scope:', registration.scope);
        })
        .catch(error => {
          console.error('Registrace Service Workeru selhala:', error);
        });
    });
  }  

// Přepínání záložek
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

// Herní logika
let balance = 1000; // Výchozí prostředky
let bet = 10; // Výchozí sázka
let probabilities = {
    '🍒': 50,
    '🍋': 30,
    '🍉': 20
};

const symbols = ['🍒', '🍋', '🍉'];
const spinSound = document.getElementById('spin-sound');
const winSound = document.getElementById('win-sound');

function spinReels() {
    if (balance < bet) {
        alert('Nemáte dostatek prostředků na sázku!');
        return;
    }

    // Odečtení sázky
    balance -= bet;
    updateBalance();

    // Spuštění zvuku a točení
    spinSound.currentTime = 0;
    spinSound.play();

    const reelElements = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')];
    const interval = setInterval(() => {
        reelElements.forEach(reel => {
            reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        });
    }, 100);

    // Po 3 sekundách zastavení
    setTimeout(() => {
        clearInterval(interval);
        spinSound.pause();

        // Nastavení výsledků
        const reels = [];
        for (let i = 0; i < 3; i++) {
            reels.push(getRandomSymbol());
        }

        reelElements.forEach((reel, index) => {
            reel.textContent = reels[index];
        });

        // Kontrola výhry
        if (reels[0] === reels[1] && reels[1] === reels[2]) {
            winSound.currentTime = 0;
            winSound.play();
            const winAmount = bet * 5; // Výhra je 5x sázka
            balance += winAmount;
            updateBalance();
            document.getElementById('result').textContent = `Výhra! Vyhráli jste ${winAmount} Kč.`;
        } else {
            document.getElementById('result').textContent = 'Prohra. Zkuste to znovu!';
        }
    }, 3000);
}

function getRandomSymbol() {
    const total = Object.values(probabilities).reduce((a, b) => a + b, 0);
    let rand = Math.random() * total;
    for (const symbol of symbols) {
        if (rand < probabilities[symbol]) {
            return symbol;
        }
        rand -= probabilities[symbol];
    }
}

function saveSettings() {
    const cherryProb = parseInt(document.getElementById('cherry-prob').value) || 0;
    const lemonProb = parseInt(document.getElementById('lemon-prob').value) || 0;
    const watermelonProb = parseInt(document.getElementById('watermelon-prob').value) || 0;

    const total = cherryProb + lemonProb + watermelonProb;
    if (total !== 100) {
        alert('Součet pravděpodobností musí být 100%!');
        return;
    }

    probabilities['🍒'] = cherryProb;
    probabilities['🍋'] = lemonProb;
    probabilities['🍉'] = watermelonProb;

    alert('Nastavení uloženo.');
}

function setBet() {
    const newBet = parseInt(document.getElementById('bet').value);
    if (newBet > 0 && newBet <= balance) {
        bet = newBet;
        document.getElementById('current-bet').textContent = bet;
    } else {
        alert('Neplatná sázka!');
    }
}

function updateBalance() {
    document.getElementById('balance').textContent = `${balance} Kč`;
}

document.getElementById('spin-button').addEventListener('click', spinReels);
document.getElementById('save-settings').addEventListener('click', saveSettings);
document.getElementById('set-bet').addEventListener('click', setBet);
