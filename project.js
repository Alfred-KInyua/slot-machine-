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
const des = deposit();
const lines = get_num_of_lines();
