
let start = document.getElementById('start');

let btnIncomeAdd = document.getElementsByTagName('button')[0];
let btnExpensesAdd = document.getElementsByTagName('button')[1];

let deposit = document.querySelector('#deposit-check');

let inputs = document.querySelectorAll('.additional_income-item');

let clsValue = document.querySelectorAll('input[class*="-value"]');

let leftInputs = document.querySelector('.data').querySelectorAll('input[type="text"]');
let salaryAmount = leftInputs[0];
let incomeTitle = leftInputs[1];
let incomeAmount = leftInputs[2];
let expensesTitle = leftInputs[5];
let expensesAmount = leftInputs[6];
let addExpensesItem = leftInputs[7];
let depositAmount = leftInputs[8];
let depositPercent = leftInputs[9];
let targetAmount = leftInputs[10];

let range = document.querySelector('input[type="range"]');

let depositBank = document.querySelector('.deposit-bank');

let cancelButton = document.querySelectorAll('#cancel');

// console.log(document.querySelectorAll('body')[0].querySelectorAll('input'));


