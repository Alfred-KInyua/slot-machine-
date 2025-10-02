const prompt = require("prompt-sync")();
const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};
const SYMBOLS_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

const deposit = () => {
  while (true) {
    const deposit_amount = prompt("Enter a deposit amount: ");
    const number_deposit_amount = parseFloat(deposit_amount);
    if (isNaN(number_deposit_amount) || number_deposit_amount <= 0) {
      console.log("Invalid deposit, try again");
    } else {
      return number_deposit_amount;
    }
  }
};
const get_num_of_lines = () => {
  while (true) {
    const lines = prompt("Enter a number of lines (1-3)");
    const line_numbers = parseFloat(lines);
    if (isNaN(line_numbers) || line_numbers <= 0 || line_numbers > 3) {
      console.log("Invalid number of lines, try again");
    } else {
      return line_numbers;
    }
  }
};
const get_bet = (balance, lines) => {
  while (true) {
    const bet = prompt("Enter the total bet per line ");
    const number_bet = parseFloat(bet);
    if (isNaN(number_bet) || number_bet <= 0 || number_bet > balance / lines) {
      console.log("Invalid bet, try again ");
    } else {
      return number_bet;
    }
  }
};
const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }
  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbol = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomindex = Math.floor(Math.random() * reelSymbol.length);
      const selecetdSymbol = reelSymbol[randomindex];
      reels[i].push(selecetdSymbol);
      reelSymbol.splice(randomindex, 1);
    }
  }
  return reels;
};
const transpose = (reels) => {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
};
const printRows = (rows) => {
  for (const row of rows) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol;
      if (i != row.length - 1) {
        rowString += " | ";
      }
    }
    console.log(rowString);
  }
};

let balance = deposit();
const lines = get_num_of_lines();
const bet = get_bet(balance, lines);
const reels = spin();
const rows = transpose(reels);
printRows(rows);
