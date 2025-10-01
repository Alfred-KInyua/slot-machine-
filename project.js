const prompt = require ("prompt-sync")(); 
let count=3;
const deposit =()=>{
    while(count>0){
    const deposit_amount= prompt("Enter a deposit amount: ");
    const number_deposit_amount= parseFloat(deposit_amount);
    if (isNaN(number_deposit_amount) || number_deposit_amount<=0){
        console.log("Invalid deposit, try again");
    }
     
    else{
        return number_deposit_amount;
    }
    
  
}
}
const des= deposit();
console.log("Your balance is " +des+ " dollars");