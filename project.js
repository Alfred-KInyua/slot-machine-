const prompt = require("prompt-sync")();
const ROWS = 3;
const COLS = 3;

const SYMBOLS_CONFIG = {
  A: { count: 2, value: 5 },
  B: { count: 4, value: 4 },
  C: { count: 6, value: 3 },
  D: { count: 8, value: 2 },
};

// Format currency for consistent display
const formatMoney = (amount) => {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
};

// Validate numeric input with range checks
const validateNumberInput = (input, min, max, errorMessage) => {
  const number = parseFloat(input);
  if (isNaN(number) || number < min || number > max) {
    console.log(errorMessage);
    return false;
  }
  return number;
};

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

const getNumberOfLines = () => {
  while (true) {
    const linesInput = prompt("Enter number of lines to bet (1-3): ");
    const lines = validateNumberInput(
      linesInput,
      1,
      3,
      "Invalid number of lines. Please enter 1, 2, or 3."
    );

    if (lines) return Math.floor(lines); // Ensure integer value
  }
};

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

const spin = () => {
  const reels = [];
  const symbols = [];

  // Create symbol pool based on configuration
  for (const [symbol, { count }] of Object.entries(SYMBOLS_CONFIG)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  // Generate reels
  for (let i = 0; i < COLS; i++) {
    const reel = [];
    const reelSymbols = [...symbols]; // Fresh copy for each reel

    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      reel.push(reelSymbols[randomIndex]);
      reelSymbols.splice(randomIndex, 1);
    }

    reels.push(reel);
  }

  return reels;
};

const transpose = (reels) => {
  return reels[0].map((_, colIndex) => reels.map((row) => row[colIndex]));
};

const printRows = (rows) => {
  console.log("\nSlot Results:");
  rows.forEach((row) => {
    console.log(row.join(" | "));
  });
  console.log();
};

const getWinnings = (rows, bet, lines) => {
  let winnings = 0;

  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    const firstSymbol = symbols[0];
    const isWinningRow = symbols.every((symbol) => symbol === firstSymbol);

    if (isWinningRow) {
      winnings += bet * SYMBOLS_CONFIG[firstSymbol].value;
    }
  }

  return winnings;
};

const game = () => {
  console.log("🎰 Welcome to the Slot Machine! 🎰");
  let balance = deposit();

  while (true) {
    console.log(`\nCurrent balance: ${formatMoney(balance)}`);

    const lines = getNumberOfLines();
    const bet = getBet(balance, lines);
    const totalBet = bet * lines;

    balance -= totalBet;
    console.log(`Total bet: ${formatMoney(totalBet)}`);

    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);

    const winnings = getWinnings(rows, bet, lines);
    balance += winnings;

    console.log(
      winnings > 0
        ? `🎉 You won ${formatMoney(winnings)}! 🎉`
        : "No wins this spin."
    );

    if (balance <= 0) {
      console.log("\n⚠️ You're out of funds. Game over! ⚠️");
      break;
    }

    const playAgain = prompt("Play again? (y/n) ").toLowerCase();
    if (playAgain !== "y") {
      console.log(`\n💰 Final balance: ${formatMoney(balance)} 💰`);
      console.log("Thanks for playing!");
      break;
    }
  }
};

game();
