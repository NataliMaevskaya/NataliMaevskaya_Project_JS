'use strict';

let start = document.getElementById('start'),
    cancel = document.getElementById('cancel'),
    btnPlus = document.getElementsByTagName('button'),
    incomePlus = btnPlus[0],
    expensesPlus = btnPlus[1],
    additionalIncomeItem = document.querySelectorAll('.additional_income-item'),
    depositCheck = document.querySelector('#deposit-check'),
    budgetDayValue = document.getElementsByClassName('budget_day-value')[0],
    budgetMonthValue = document.getElementsByClassName('budget_month-value')[0],
    expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0],
    accumulatedMonthValue = document.getElementsByClassName('accumulated_month-value')[0],
    additionalIncomeValue = document.getElementsByClassName('additional_income-value')[0],
    additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0],
    incomePeriodValue = document.getElementsByClassName('income_period-value')[0],
    targetMonthValue = document.getElementsByClassName('target_month-value')[0],
    salaryAmount = document.querySelector('.salary-amount'),
    incomeTitle = document.querySelector('.income-title'),
    expensesTitle = document.querySelector('.expenses-title'),
    expensesItems = document.querySelectorAll('.expenses-items'),
    addititonalExpenses = document.querySelector('.additional_expenses'),
    periodSelect = document.querySelector('.period-select'),
    periodAmount = document.querySelector('.period-amount'),
    additionalExpensesItem = document.querySelector('.additional_expenses-item'),
    targetAmount = document.querySelector('.target-amount'),
    incomeItems = document.querySelectorAll('.income-items');

let appData = {
    budget: 0,
    income: {},
    incomeMonth: 0,
    addIncome: [],
    expenses: {},
    addExpenses: [],
    deposit: false,
    percentDeposit: 0,
    moneyDeposit: 0,
    budgetDay: 0,
    budgetMonth: 0,
    expensesMonth: 0,
    start: function() {
        
        if (salaryAmount.value === '') {
            
            start.setAttribute('disabled');
            return;
        }
        
        this.budget = +salaryAmount.value;

        this.getExpenses();
        this.getIncome();
        this.getExpensesMonth();
        this.getAddExpenses();
        this.getAddIncome();
        this.getBudget();   

        this.showResult();  
        this.textInputDisabled();
        this.startOffCancelOn();             
    },
    showResult: function() {
        budgetMonthValue.value = this.budgetMonth;
        budgetDayValue.value = Math.floor(this.budgetDay);
        expensesMonthValue.value = this.expensesMonth;
        additionalExpensesValue.value = this.addExpenses.join(', ');
        additionalIncomeValue.value = this.addIncome.join(', ');
        targetMonthValue.value = this.getTargetMonth();
        incomePeriodValue.value = this.calcSavedMoney();
        periodSelect.addEventListener('change', this.calcIncomePeriod);
        
    },
    addExpensesBlock: function() {
        
        let cloneExpensesItem = expensesItems[0].cloneNode(true);
        expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
        expensesItems = document.querySelectorAll('.expenses-items');

        if (expensesItems.length === 3) {
            expensesPlus.style.display = 'none';
        }

    },
    addIncomeBlock: function() {
        let cloneIncomeItem = incomeItems[0].cloneNode(true);
        incomeItems[0].parentNode.insertBefore(cloneIncomeItem, incomePlus);
        incomeItems = document.querySelectorAll('.income-items');

        if (incomeItems.length === 3) {
            incomePlus.style.display = 'none';
        }
    },
    changePeriod: function() {
        periodAmount.textContent = periodSelect.value;
    },
    calcIncomePeriod: function() {
        incomePeriodValue.value = appData.calcSavedMoney();
    },
    textInputDisabled: function() {
        let textInputs = document.querySelectorAll('input[type="text"]');
        textInputs.forEach(function(item) {
            item.disabled = 'disabled';
        });
    },
    startOffCancelOn: function() {
        start.style.display = 'none';
        cancel.style.display = 'block';
    },
    reset: function() {
        let allInputText = document.querySelectorAll('input[type="text"]');
        allInputText.forEach(function(item) {
            item.value = '';
            item.removeAttribute('disabled');
        });
        let inputRange = document.querySelectorAll('input[type="range"]');
        inputRange[0].value = '1';
        periodAmount.textContent = '1';

        start.style.display = 'block';
        cancel.style.display = 'none';
    },
    getExpenses: function() {
        expensesItems.forEach(function(item){
            let itemExpenses = item.querySelector('.expenses-title').value;
            let cashExpenses = item.querySelector('.expenses-amount').value;
            if (itemExpenses !== '' && cashExpenses !== '') {
                appData.expenses[itemExpenses] = +cashExpenses;
            }
        });
    },
    getIncome: function() {
        incomeItems.forEach(function(item) {
            let itemIncome = item.querySelector('.income-title').value;
            let cashIncome = item.querySelector('.income-amount').value;
            if ( itemIncome !== '' && cashIncome !== 0) {
                appData.income[itemIncome] = cashIncome;
            }
        });

        for (let key in this.income) {
            this.incomeMonth += +this.income[key];
        }
    },
    getAddExpenses: function(){
        let addExpenses = additionalExpensesItem.value.split(',');
        addExpenses.forEach(function(item) {
            item = item.trim();
            if (item !== '') {
                appData.addExpenses.push(item);
            }
        });
    },
    getAddIncome: function(){
        additionalIncomeItem.forEach(function(item) {
            let itemValue = item.value.trim();
            if (itemValue !== '') {
                appData.addIncome.push(itemValue);
            }
        });
    },
    getExpensesMonth: function() {
        for (let key in this.expenses) {
            // console.log(key);
            this.expensesMonth += +(this.expenses[key]);
        }
        return this.expensesMonth;
    },
    getBudget: function() {
        this.budgetMonth = +this.budget + this.incomeMonth - this.expensesMonth;
        this.budgetDay = this.budgetMonth / 30;
    }, 
    getTargetMonth: function() {
        return Math.ceil(targetAmount.value / this.budgetMonth);
    },
    getStatusIncome: function() {
        if (this.budgetDay >= 800) {
            console.log('Высокий уровень дохода');
        } else if (this.budgetDay >= 300 && this.budgetDay < 800) {
            console.log('Средний уровень дохода');
        } else if ( this.budgetDay >= 0 && this.budgetDay < 300) {
            console.log('Низкий уровень дохода');
        } else {
            console.log('Что-то пошло не так');
        }
    },
    getInfoDeposit: function() {
        this.deposit = confirm('Есть ли у вас депозит в банке? (ОК - да, Отмена - нет)');
        if (this.deposit) {
            do {
                this.percentDeposit = prompt('Какой годовой процент?', 10);
            } while(isNaN(this.percentDeposit) || this.percentDeposit <= 0 ||
                    this.percentDeposit === '' || this.percentDeposit === null);
            do {
                this.moneyDeposit = prompt('Какая сумма заложена?', 10000);
            } while(isNaN(this.moneyDeposit) || this.moneyDeposit <= 0 ||
                    this.moneyDeposit === '' || this.moneyDeposit === null);
        }
    },
    calcSavedMoney: function() {
        return this.budgetMonth * periodSelect.value;
    }
};

start.addEventListener('click', appData.start.bind(appData));

expensesPlus.addEventListener('click', appData.addExpensesBlock);
incomePlus.addEventListener('click', appData.addIncomeBlock);
periodSelect.addEventListener('change', appData.changePeriod);
cancel.addEventListener('click', appData.reset);

// Обязательные расходы
// console.log('Расходы за месяц: ', appData.expensesMonth);

// Накопления за месяц, бюджет на день

// console.log('Накопления за месяц: ', appData.budgetMonth);

// Срок достижения цели
// let numMonthMission = appData.getTargetMonth();
// if ( !isFinite(numMonthMission) || numMonthMission < 0 || isNaN(numMonthMission)) { 
//     console.log('Цель не будет достигнута!');
// } else {
//     console.log('Накопить ' + appData.mission + ' возможно через ' + numMonthMission + ' месяцев.');
// }

// // Уровень дохода
// appData.getStatusIncome();
// // Инфо о депозите
// appData.getInfoDeposit();
// // Накопления за период
// console.log('Накопления за ' + appData.period + ' месяцев: ' + appData.calcSavedMoney());

// console.log('Наша программа включает в себя данные: ');
// for (let key in appData) {
//     console.log(key + ': ' + appData[key]);
// }

// for (let i = 0; i < appData.addExpenses.length; i++) {
//     appData.addExpenses[i] = appData.addExpenses[i].charAt(0).toUpperCase() + appData.addExpenses[i].slice(1);
// }
// console.log('Дополнительные расходы: ' + appData.addExpenses.join(', '));



    