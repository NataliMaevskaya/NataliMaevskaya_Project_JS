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
    incomeItems = document.querySelectorAll('.income-items'),
    textInputs = document.querySelectorAll('input[type="text"]'),
    inputsLetters = document.querySelectorAll('input[placeholder="Наименование"]'),
    inputsNumbers = document.querySelectorAll('input[placeholder="Сумма"]');

const AppData = function() {
    this.budget = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.income = {};
    this.incomeMonth = 0;
    this.addIncome = [];
    this.expenses = {};
    this.expensesMonth = 0;
    this.addExpenses = [];
    this.deposit = false;
    this.percentDeposit = 0;
    this.moneyDeposit = 0;
    
    

}; 

AppData.prototype.readyToStart = function() {
    if (salaryAmount.value !== '') {
        start.removeAttribute('disabled');
    }
};
AppData.prototype.start = function() {
    if (salaryAmount.value === '') {
        start.setAttribute('disabled', 'true');
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
};
AppData.prototype.showResult = function() {
    budgetMonthValue.value = this.budgetMonth;
    budgetDayValue.value = Math.floor(this.budgetDay);
    expensesMonthValue.value = this.expensesMonth;
    additionalExpensesValue.value = this.addExpenses.join(', ');
    additionalIncomeValue.value = this.addIncome.join(', ');
    targetMonthValue.value = this.getTargetMonth();
    incomePeriodValue.value = this.calcSavedMoney();
    periodSelect.addEventListener('input', this.calcIncomePeriod.bind(this));
    
};
AppData.prototype.addExpensesBlock = function() {
    const _this = this;
    let cloneExpensesItem = expensesItems[0].cloneNode(true);
    cloneExpensesItem.querySelectorAll('input').forEach(function(item) {
        item.value = '';
    });
    expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
    expensesItems = document.querySelectorAll('.expenses-items');

    if (expensesItems.length === 3) {
        expensesPlus.style.display = 'none';
    }
    
    inputsLetters = document.querySelectorAll('input[placeholder="Наименование"]');
    inputsNumbers = document.querySelectorAll('input[placeholder="Сумма"]');
    
    inputsNumbers.forEach(function(item) {
        item.addEventListener('keypress', _this.checkNumbers);
    });
    
    inputsLetters.forEach(function(item) {
        item.addEventListener('keypress', _this.checkRusLetters);
    });

};
AppData.prototype.addIncomeBlock = function() {
    const _this = this;
    let cloneIncomeItem = incomeItems[0].cloneNode(true);
    cloneIncomeItem.querySelectorAll('input').forEach(function(item) {
        item.value = '';
    });
    incomeItems[0].parentNode.insertBefore(cloneIncomeItem, incomePlus);
    incomeItems = document.querySelectorAll('.income-items');

    if (incomeItems.length === 3) {
        incomePlus.style.display = 'none';
    }
    inputsLetters = document.querySelectorAll('input[placeholder="Наименование"]');
    inputsNumbers = document.querySelectorAll('input[placeholder="Сумма"]');
    
    inputsNumbers.forEach(function(item) {
        item.addEventListener('keypress', _this.checkNumbers);
    });
    
    inputsLetters.forEach(function(item) {
        item.addEventListener('keypress', _this.checkRusLetters);
    });
};
AppData.prototype.checkRusLetters = function (e) {
    let theEvent = e || window.event;
    let key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode( key );
    let regex = /[А-яЁё\s\,\.\:\;]/;
    if( !regex.test(key) ) {
        theEvent.returnValue = false;
        if(theEvent.preventDefault) {
            theEvent.preventDefault();
        }
    }
};
AppData.prototype.checkNumbers = function (e) {
    if (e.which < 48 || e.which > 57)
    {
        e.preventDefault();
    }
};

AppData.prototype.changePeriod = function() {
    periodAmount.textContent = periodSelect.value;
};
AppData.prototype.calcIncomePeriod = function() {
    incomePeriodValue.value = this.calcSavedMoney();
};
AppData.prototype.textInputDisabled = function() {
    let textInputs = document.querySelectorAll('input[type="text"]');
    textInputs.forEach(function(item) {
        item.disabled = 'disabled';
    });
};
AppData.prototype.startOffCancelOn = function() {
    start.style.display = 'none';
    cancel.style.display = 'block';
};
AppData.prototype.reset = function() {
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
};
AppData.prototype.getExpenses = function() {
    const _this = this;
    expensesItems.forEach(function(item){
        let itemExpenses = item.querySelector('.expenses-title').value;
        let cashExpenses = item.querySelector('.expenses-amount').value;
        if (itemExpenses !== '' && cashExpenses !== '') {
            _this.expenses[itemExpenses] = +cashExpenses;
        }
    });
};
AppData.prototype.getIncome = function() {
    const _this = this;
    incomeItems.forEach(function(item) {
        let itemIncome = item.querySelector('.income-title').value;
        let cashIncome = item.querySelector('.income-amount').value;
        if ( itemIncome !== '' && cashIncome !== 0) {
            _this.income[itemIncome] = cashIncome;
        }
    });

    for (let key in this.income) {
        this.incomeMonth += +this.income[key];
    }
};
AppData.prototype.getAddExpenses = function(){
    const _this = this;
    let addExpenses = additionalExpensesItem.value.split(',');
    addExpenses.forEach(function(item) {
        item = item.trim();
        if (item !== '') {
            _this.addExpenses.push(item);
        }
    });
};
AppData.prototype.getAddIncome = function(){
    const _this = this;
    additionalIncomeItem.forEach(function(item) {
        let itemValue = item.value.trim();
        if (itemValue !== '') {
            _this.addIncome.push(itemValue);
        }
    });
};
AppData.prototype.getExpensesMonth = function() {
    for (let key in this.expenses) {
        this.expensesMonth += +(this.expenses[key]);
    }
    return this.expensesMonth;
};
AppData.prototype.getBudget = function() {
    this.budgetMonth = +this.budget + this.incomeMonth - this.expensesMonth;
    this.budgetDay = this.budgetMonth / 30;
}; 
AppData.prototype.getTargetMonth = function() {
    return Math.ceil(targetAmount.value / this.budgetMonth);
};
AppData.prototype.getStatusIncome = function() {
    if (this.budgetDay >= 800) {
        console.log('Высокий уровень дохода');
    } else if (this.budgetDay >= 300 && this.budgetDay < 800) {
        console.log('Средний уровень дохода');
    } else if ( this.budgetDay >= 0 && this.budgetDay < 300) {
        console.log('Низкий уровень дохода');
    } else {
        console.log('Что-то пошло не так');
    }
};
AppData.prototype.getInfoDeposit = function() {
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
};
AppData.prototype.calcSavedMoney = function() {
    return this.budgetMonth * periodSelect.value;
};
AppData.prototype.eventListeners = function() {
    const _this = this;
    salaryAmount.addEventListener('keyup', this.readyToStart);
    start.addEventListener('click', this.start.bind(this));

    expensesPlus.addEventListener('click', this.addExpensesBlock.bind(this));
    incomePlus.addEventListener('click', this.addIncomeBlock.bind(this));
    periodSelect.addEventListener('input', this.changePeriod);
    cancel.addEventListener('click', this.reset);

    inputsNumbers.forEach(function(item) {
        item.addEventListener('keypress', _this.checkNumbers);
    });

    inputsLetters.forEach(function(item) {
        item.addEventListener('keypress', _this.checkRusLetters);
    });
};


const appData = new AppData();
appData.eventListeners();

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



    