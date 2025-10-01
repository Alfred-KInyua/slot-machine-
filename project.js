const prompt = require("prompt-sync")();
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
let balance = deposit();
const lines = get_num_of_lines();
const bet = get_bet(balance, lines);
