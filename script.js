"use strict";

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

const labelWelcome = document.querySelector(".user-welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".current-balance");
const labelSumIn = document.querySelector(".credit-amount");
const labelSumOut = document.querySelector(".debit-amount");
const labelSumInterest = document.querySelector(".interest-amount");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector("#app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login-button");
const btnTransfer = document.querySelector(".transfer-btn");
const Loan = document.querySelector(".request-btn");
const Close = document.querySelector(".close-btn");
const btnSort = null;

const inputLoginUsername = document.querySelector("#user-name");
const inputLoginPin = document.querySelector("#user-pin");
const inputTransferTo = document.querySelector(".transfer-to");
const inputTransferAmount = document.querySelector(".transfer-amount");
const inputLoanAmount = document.querySelector(".request-amount");
const inputCloseUsername = document.querySelector(".user-confirm");
const inputClosePin = document.querySelector(".user-pin-confirm");
const bankLogo = document.querySelector(".bank-logo");

function calcBalance(acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  acc.balance = balance;
  labelBalance.textContent = `${balance}$`;
}
function calcDeposits(movements) {
  const movement = movements.filter((mov) => mov > 0);
  const netDeposits = movement.reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${netDeposits}$`;
}
function calcWithdrawls(movements) {
  const movement = movements.filter((mov) => mov < 0);
  const netDeposits = movement.reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${netDeposits}$`;
}

function displayMovements(movements) {
  containerMovements.innerHTML = "";
  movements.forEach((element, i) => {
    let type;
    element > 0 ? (type = "deposit") : (type = "withdrawl");
    const html = ` <div class="movements-row">
                             <div class="movement-type ${type}">${
      i + 1
    }. ${type}
                            </div>
                          <div class="movement-date">3 days ago</div>
                          <div class ="movement-value">${element}$</div>
            </div> `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

function createUserName(accountsArr) {
  accountsArr.forEach(function (accountsArr) {
    const [first, second] = accountsArr.owner.toLowerCase().split(" ");
    accountsArr.userName = first[0] + second[0];
  });
}

function calcInterest(acc, interestRate) {
  const interest = acc
    .filter((mov) => mov > 0)
    .map((mov) => (mov * interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}$`;
}
function loginMessage(account) {
  labelWelcome.textContent = `Welcome back, ${account.owner}`;
  labelDate.textContent = `${newDate}`;
}

function updateUI(currentAccount) {
  calcBalance(currentAccount);
  calcDeposits(currentAccount.movements);
  calcWithdrawls(currentAccount.movements);
  displayMovements(currentAccount.movements);
  calcInterest(currentAccount.movements, currentAccount.interestRate);
  loginMessage(currentAccount);
  containerApp.style.opacity = ".8";
  bankLogo.style.opacity = ".5";
}

createUserName(accounts);

let currentAccount;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    updateUI(currentAccount);
  } else {
    alert("wrong username or pin");
  }
  inputLoginPin.value = inputLoginUsername.value = "";
  inputLoginPin.blur();
});

btnTransfer.addEventListener("click", function () {
  const amount = Number(inputTransferAmount.value);
  let receiverAcc = inputTransferTo.value;
  receiverAcc = accounts.find((acc) => acc.userName === receiverAcc);

  if (
    receiverAcc &&
    currentAccount.balance >= amount &&
    amount > 0 &&
    receiverAcc.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    console.log("transfer succesful");
    console.log(currentAccount, receiverAcc);
    updateUI(currentAccount);
  } else if (currentAccount.balance < amount) {
    alert("Insufficient Amount");
  } else {
    alert("Wrong Username");
  }
  inputTransferTo.value = inputTransferAmount.value = "";
});

Close.addEventListener("click", function () {
  if (
    currentAccount.userName === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      (mov) => mov.userName === currentAccount.userName
    );
    accounts.splice(index, 1);
    updateUI(currentAccount);
    containerApp.style.opacity = "0";
  } else {
    alert("Wrong details");
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

Loan.addEventListener("click", function () {
  if (
    currentAccount.movements.some((mov) => mov >= inputLoanAmount.value * 0.1)
  ) {
    currentAccount.movements.push(Number(inputLoanAmount.value));
    updateUI(currentAccount);
  } else {
    alert("loan denied");
  }
});

const date = new Date();
const newDate = `${date.getDay()}/${date.getMonth() + 1}/${date.getFullYear()}`;
