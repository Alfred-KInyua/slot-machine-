const prompt = require("prompt-sync")();
const ROWS = 3;
const COLS = 3;

// Symbol configuration with colors
const SYMBOLS_CONFIG = {
  A: { count: 2, value: 5, color: "\x1b[31m" }, // Red
  B: { count: 4, value: 4, color: "\x1b[34m" }, // Blue
  C: { count: 6, value: 3, color: "\x1b[32m" }, // Green
  D: { count: 8, value: 2, color: "\x1b[33m" }, // Yellow
};

// Animation symbols for spinning effect
const SPINNER_SYMBOLS = [
  "◐",
  "◓",
  "◑",
  "◒",
  "●",
  "◆",
  "▲",
  "■",
  "♥",
  "♠",
  "♦",
  "♣",
];

// Format money display
const formatMoney = (amount) => {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
};

// Clear console
const clearConsole = () => {
  process.stdout.write("\x1B[2J\x1B[0f");
};

// Print with color
const colorPrint = (text, colorCode) => {
  console.log(`${colorCode}${text}\x1b[0m`);
};

// Print centered text
const printCentered = (text, width = 50) => {
  const padding = Math.max(0, Math.floor((width - text.length) / 2));
  console.log(" ".repeat(padding) + text);
};

// Print separator
const printSeparator = (char = "=", length = 50) => {
  console.log(char.repeat(length));
};

// Validate numeric input
const validateNumberInput = (input, min, max, errorMessage) => {
  const number = parseFloat(input);
  if (isNaN(number) || number < min || number > max) {
    colorPrint(errorMessage, "\x1b[31m");
    return false;
  }
  return number;
};

// Deposit function
const deposit = () => {
  while (true) {
    const depositInput = prompt("Enter deposit amount (minimum $1): ");
    const amount = validateNumberInput(
      depositInput,
      1,
      Number.MAX_SAFE_INTEGER,
      "Invalid amount. Minimum deposit is $1."
    );

    if (amount) return amount;
  }
};

// Get number of lines
const getNumberOfLines = () => {
  while (true) {
    const linesInput = prompt("Enter number of lines to bet (1-3): ");
    const lines = validateNumberInput(
      linesInput,
      1,
      3,
      "Invalid number of lines. Please enter 1, 2, or 3."
    );

    if (lines) return Math.floor(lines);
  }
};

// Get bet amount
const getBet = (balance, lines) => {
  while (true) {
    const maxBet = balance / lines;
    const betInput = prompt(
      `Enter bet per line (max ${formatMoney(maxBet)}): `
    );

    const bet = validateNumberInput(
      betInput,
      0.01,
      maxBet,
      `Invalid bet. Must be between ${formatMoney(0.01)}-${formatMoney(maxBet)}`
    );

    if (bet) return bet;
  }
};

// Create reels with symbols
const createReels = () => {
  const symbols = [];
  for (const [symbol, { count }] of Object.entries(SYMBOLS_CONFIG)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }
  return symbols;
};

// Spin animation
const animateSpin = async (reelSymbols, finalReels) => {
  return new Promise((resolve) => {
    const spinDuration = 2000; // 2 seconds
    const frameInterval = 100; // Update every 100ms
    const frames = spinDuration / frameInterval;
    let currentFrame = 0;

    const spinInterval = setInterval(() => {
      clearConsole();

      // Print game header
      printSeparator("=");
      printCentered("🎰 SLOT MACHINE 🎰");
      printSeparator("=");
      console.log();

      // Create current animation state
      const animationReels = [];
      for (let col = 0; col < COLS; col++) {
        animationReels.push([]);
        for (let row = 0; row < ROWS; row++) {
          // For first 80% of animation, show random symbols
          if (currentFrame < frames * 0.8) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const symbol = reelSymbols[randomIndex];
            animationReels[col].push(symbol);
          }
          // For last 20% of animation, transition to final result
          else {
            const progress = (currentFrame - frames * 0.8) / (frames * 0.2);
            if (Math.random() < progress) {
              animationReels[col].push(finalReels[col][row]);
            } else {
              const randomIndex = Math.floor(
                Math.random() * SPINNER_SYMBOLS.length
              );
              animationReels[col].push(SPINNER_SYMBOLS[randomIndex]);
            }
          }
        }
      }

      // Transpose and print animated reels
      const animatedRows = transpose(animationReels);
      printReels(animatedRows);

      // Draw spinning indicator
      const spinner =
        SPINNER_SYMBOLS[Math.floor(currentFrame / 2) % SPINNER_SYMBOLS.length];
      printCentered(`${spinner} SPINNING ${spinner}`);
      console.log();

      currentFrame++;
      if (currentFrame >= frames) {
        clearInterval(spinInterval);
        resolve();
      }
    }, frameInterval);
  });
};

// Transpose reels
const transpose = (reels) => {
  return reels[0].map((_, colIndex) => reels.map((row) => row[colIndex]));
};

// Print reels with colors
const printReels = (rows) => {
  for (const row of rows) {
    let rowString = "";
    for (const symbol of row) {
      if (SYMBOLS_CONFIG[symbol]) {
        rowString += `${SYMBOLS_CONFIG[symbol].color}${symbol}\x1b[0m | `;
      } else {
        rowString += `${symbol} | `;
      }
    }
    printCentered(rowString.slice(0, -3)); // Remove trailing separator
  }
};

// Calculate winnings
const getWinnings = (rows, bet, lines) => {
  let winnings = 0;

  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    const firstSymbol = symbols[0];
    const isWinningRow = symbols.every((symbol) => symbol === firstSymbol);

    if (isWinningRow && SYMBOLS_CONFIG[firstSymbol]) {
      winnings += bet * SYMBOLS_CONFIG[firstSymbol].value;
    }
  }

  return winnings;
};

// Highlight winning rows
const highlightWinningRows = (rows, lines) => {
  const highlightedRows = [...rows];

  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    const firstSymbol = symbols[0];
    const isWinningRow = symbols.every((symbol) => symbol === firstSymbol);

    if (isWinningRow) {
      highlightedRows[row] = symbols.map((symbol) => `*${symbol}*`);
    }
  }

  return highlightedRows;
};

// Main game function
const game = async () => {
  clearConsole();
  const reelSymbols = createReels();

  printSeparator("=");
  printCentered("🎰 WELCOME TO THE SLOT MACHINE! 🎰");
  printSeparator("=");
  console.log();

  let balance = deposit();

  while (true) {
    clearConsole();

    printSeparator("=");
    printCentered("🎰 SLOT MACHINE 🎰");
    printSeparator("=");
    console.log();

    printCentered(`Current balance: ${formatMoney(balance)}`);
    console.log();

    const lines = getNumberOfLines();
    const bet = getBet(balance, lines);
    const totalBet = bet * lines;

    balance -= totalBet;
    printCentered(`Total bet: ${formatMoney(totalBet)}`);
    console.log();

    // Generate final result
    const finalReels = [];
    for (let i = 0; i < COLS; i++) {
      const reel = [];
      const reelSymbolsCopy = [...reelSymbols];
      for (let j = 0; j < ROWS; j++) {
        const randomIndex = Math.floor(Math.random() * reelSymbolsCopy.length);
        reel.push(reelSymbolsCopy[randomIndex]);
        reelSymbolsCopy.splice(randomIndex, 1);
      }
      finalReels.push(reel);
    }
    const finalRows = transpose(finalReels);

    // Show spinning animation
    await animateSpin(reelSymbols, finalReels);

    // Display final result
    clearConsole();
    printSeparator("=");
    printCentered("🎰 SLOT MACHINE - RESULTS 🎰");
    printSeparator("=");
    console.log();

    // Highlight winning rows
    const resultRows = highlightWinningRows(finalRows, lines);
    printReels(resultRows);
    console.log();

    const winnings = getWinnings(finalRows, bet, lines);
    balance += winnings;

    if (winnings > 0) {
      colorPrint(
        `🎉 Congratulations! You won ${formatMoney(winnings)}! 🎉`,
        "\x1b[32m"
      );
    } else {
      colorPrint("No winning combinations this spin. Try again!", "\x1b[33m");
    }
    console.log();

    printCentered(`New balance: ${formatMoney(balance)}`);
    console.log();

    if (balance < 1) {
      colorPrint(
        "⚠️ You don't have enough funds to continue. Game over! ⚠️",
        "\x1b[31m"
      );
      break;
    }

    const playAgain = prompt("Play again? (y/n) ").toLowerCase();
    if (playAgain !== "y") {
      printCentered(`💰 Final balance: ${formatMoney(balance)} 💰`);
      printCentered("Thanks for playing! Come back soon!");
      break;
    }
  }
};

// Start the game
game();
