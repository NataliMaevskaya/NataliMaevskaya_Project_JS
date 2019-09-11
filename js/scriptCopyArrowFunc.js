'use strict';

const start = document.getElementById('start'),
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
    addititonalExpenses = document.querySelector('.additional_expenses'),
    periodSelect = document.querySelector('.period-select'),
    periodAmount = document.querySelector('.period-amount'),
    additionalExpensesItem = document.querySelector('.additional_expenses-item'),
    targetAmount = document.querySelector('.target-amount'),
    
    textInputs = document.querySelectorAll('input[type="text"]'),
    depositBank = document.querySelector('.deposit-bank'),
    depositAmount = document.querySelector('.deposit-amount'),
    depositPercent = document.querySelector('.deposit-percent');

    let incomeItems = document.querySelectorAll('.income-items'),    
        expensesItems = document.querySelectorAll('.expenses-items'),        
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
    AppData.prototype.readyToStart = () => {
        if (salaryAmount.value !== '') {
            start.removeAttribute('disabled');
        }
    };
    AppData.prototype.start = () => {
        if (salaryAmount.value === '') {
            start.setAttribute('disabled', 'true');
            return;
        }
        appData.budget = +salaryAmount.value;
    
        appData.getExpenses();
        appData.getIncome();
        appData.getExpensesMonth();
        appData.getAdd(additionalExpensesItem.value.split(','), appData.addExpenses);
        appData.getAdd(additionalIncomeItem, appData.addIncome);
        appData.getInfoDeposit();
        appData.getBudget();   
    
        appData.showResult();  
        appData.textInputDisabled();
        appData.startOffCancelOn();             
    };
    AppData.prototype.showResult = () => {
        budgetMonthValue.value = appData.budgetMonth;
        budgetDayValue.value = Math.floor(appData.budgetDay);
        expensesMonthValue.value = appData.expensesMonth;
        additionalExpensesValue.value = appData.addExpenses.join(', ');
        additionalIncomeValue.value = appData.addIncome.join(', ');
        targetMonthValue.value = appData.getTargetMonth();
        incomePeriodValue.value = appData.calcSavedMoney();
        periodSelect.addEventListener('input', appData.calcIncomePeriod.bind(appData));        
    };
    AppData.prototype.addBlock = (items, plus, className) => {
        const cloneItem = items[0].cloneNode(true);
        cloneItem.querySelectorAll('input').forEach((item) => {
            item.value = '';
        });
        items[0].parentNode.insertBefore(cloneItem, plus);
        items = document.querySelectorAll(className);
    
        if (items.length === 3) {
            plus.style.display = 'none';
        }
        
        inputsLetters = document.querySelectorAll('input[placeholder="Наименование"]');
        inputsNumbers = document.querySelectorAll('input[placeholder="Сумма"]');
        
        inputsNumbers.forEach((item) => {
            item.addEventListener('keypress', appData.checkNumbers);
        });
        
        inputsLetters.forEach((item) => {
            item.addEventListener('keypress', appData.checkRusLetters);
        });
    
    };
    AppData.prototype.checkRusLetters = (e) => {
        const theEvent = e || window.event;
        let key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode( key );
        const regex = /[А-яЁё\s\,\.\:\;]/;
        if( !regex.test(key) ) {
            theEvent.returnValue = false;
            if(theEvent.preventDefault) {
                theEvent.preventDefault();
            }
        }
    };
    AppData.prototype.checkNumbers = (e) => {
        if (e.which < 48 || e.which > 57)
        {
            e.preventDefault();
        }
    };
    
    AppData.prototype.changePeriod = () => {
        periodAmount.textContent = periodSelect.value;
    };
    AppData.prototype.calcIncomePeriod = () => {
        incomePeriodValue.value = appData.calcSavedMoney();
    };
    AppData.prototype.textInputDisabled = () => {
        const textInputs = document.querySelectorAll('input[type="text"]');
        textInputs.forEach((item) => {
            item.disabled = 'disabled';
        });
        depositBank.disabled = 'disabled';
    };
    AppData.prototype.startOffCancelOn = () => {
        start.style.display = 'none';
        cancel.style.display = 'block';
    };
    AppData.prototype.reset = () => {
        for (const member in appData) {
            if (typeof appData[member] === 'number') {
                appData[member] = 0;
            } else
            if (Array.isArray(appData[member])) {
                appData[member].forEach((item, i, array) => {
                    delete array[i];
                });
                appData[member].length = 0;
            } else
            if (typeof appData[member] === 'object') {
                for (const key in appData[member]) {
                    delete appData[member][key];
                }
            } else if (typeof appData[member] === 'boolean') {
                appData[member] = false;
            }
        }
        depositCheck.checked = false;
        depositBank.style.display = 'none';
        depositAmount.style.display = 'none';
        depositPercent.style.display = 'none';
        const incomeForms = document.querySelectorAll('.income-items');
        for (let i = 1; i <= incomeForms.length - 1; i++){
            incomeForms[i].remove();
        }
    
        const expensesForms = document.querySelectorAll('.expenses-items');
        for (let i = 1; i <= expensesForms.length - 1; i++){
            expensesForms[i].remove();
        }
        // console.log(appData);
        const allInputText = document.querySelectorAll('input[type="text"]');
        allInputText.forEach((item) => {
            item.value = '';
            item.removeAttribute('disabled');
        });
        depositBank.removeAttribute('disabled');
        depositBank.value = 0;
    
        const inputRange = document.querySelectorAll('input[type="range"]');
        inputRange[0].value = '1';
        periodAmount.textContent = '1';
    
        start.style.display = 'block';
        cancel.style.display = 'none';
    };
    AppData.prototype.getExpenses = () => {
        expensesItems = document.querySelectorAll('.expenses-items');
        expensesItems.forEach((item) => {
            const itemExpenses = item.querySelector('.expenses-title').value;
            const cashExpenses = item.querySelector('.expenses-amount').value;
            if (itemExpenses !== '' && cashExpenses !== '') {
                appData.expenses[itemExpenses] = +cashExpenses;
            }
        });
    };
    AppData.prototype.getIncome = () => {
        incomeItems = document.querySelectorAll('.income-items');
        incomeItems.forEach((item) => {
            const itemIncome = item.querySelector('.income-title').value;
            const cashIncome = item.querySelector('.income-amount').value;
            if ( itemIncome !== '' && cashIncome !== 0) {
                appData.income[itemIncome] = +cashIncome;
            }
        });
    
        for (const key in appData.income) {
            appData.incomeMonth += +appData.income[key];
        }
    };
    AppData.prototype.getAdd = (array, objItemsArray ) => {
        if (array instanceof NodeList) {
        const arrValues = [];
        array.forEach((item) => {
            arrValues.push(item.value.trim());
        });
        array = arrValues;
        }
        array.forEach((item) => {
            item = item.trim();
            if (item !== '') {
                objItemsArray.push(item);
            }
        });
    };
    AppData.prototype.getExpensesMonth = () => {
        for (const key in appData.expenses) {
            appData.expensesMonth += +(appData.expenses[key]);
        }
        return appData.expensesMonth;
    };
    AppData.prototype.getBudget = () => {
        appData.budgetMonth = +appData.budget + appData.incomeMonth - appData.expensesMonth + (appData.moneyDeposit * appData.percentDeposit) / 12;
        appData.budgetDay = appData.budgetMonth / 30;
    }; 
    AppData.prototype.getTargetMonth = () => {
        return Math.ceil(targetAmount.value / appData.budgetMonth);
    };
    AppData.prototype.getStatusIncome = () => {
        if (appData.budgetDay >= 800) {
            console.log('Высокий уровень дохода');
        } else if (appData.budgetDay >= 300 && appData.budgetDay < 800) {
            console.log('Средний уровень дохода');
        } else if ( appData.budgetDay >= 0 && appData.budgetDay < 300) {
            console.log('Низкий уровень дохода');
        } else {
            console.log('Что-то пошло не так');
        }
    };
    AppData.prototype.getInfoDeposit = () => {
        if (appData.deposit) {
            depositPercent.value = depositPercent.value.replace(",", ".");
            appData.percentDeposit = +depositPercent.value;
            appData.moneyDeposit = +depositAmount.value;
            // } while(isNaN(appData.percentDeposit) || appData.percentDeposit <= 0 ||
            //         appData.percentDeposit === '' || appData.percentDeposit === null);
            
                
        }
    };
    AppData.prototype.calcSavedMoney =  () => {
        return appData.budgetMonth * periodSelect.value;
    };
    AppData.prototype.changeDepositBlock =  () => {
        if (depositCheck.checked) {
            depositBank.style.display = 'inline-block';
            depositAmount.style.display = 'inline-block';
            appData.deposit = true;
            depositBank.addEventListener('change', () => {
                const selectIndex = depositBank.options[depositBank.selectedIndex].value;
                if (selectIndex === 'other') {
                    depositPercent.style.display = 'inline-block';
                    depositPercent.removeAttribute('disabled');
                    depositPercent.value = '';                
                } else {
                    depositPercent.style.display = 'none';
                    depositPercent.value = selectIndex;
                }
            });
        } else {
            depositBank.style.display = 'none';
            depositAmount.style.display = 'none';
            depositAmount.value = '';
            appData.deposit = false;
        }
    };
    AppData.prototype.eventListeners =  () => {
        salaryAmount.addEventListener('keyup', appData.readyToStart);
        start.addEventListener('click', appData.start.bind(appData));
    
        expensesPlus.addEventListener('click', appData.addBlock.bind(appData, expensesItems, expensesPlus, '.expenses-items'));
        incomePlus.addEventListener('click', appData.addBlock.bind(appData, incomeItems, incomePlus, '.income-items'));
        periodSelect.addEventListener('input', appData.changePeriod);
        cancel.addEventListener('click', appData.reset.bind(appData));
    
        inputsNumbers.forEach((item) => {
            item.addEventListener('keypress', appData.checkNumbers);
        });
    
        inputsLetters.forEach((item) => {
            item.addEventListener('keypress', appData.checkRusLetters);
        });
        depositCheck.addEventListener('change', appData.changeDepositBlock.bind(appData));
    };
// }); 
const appData = new AppData();
appData.eventListeners();  
// const newData = Object.create(appData);
// console.log(newData); 
// console.log(newData.expenses);

// AppData.prototype.readyToStart = () => {
//     if (salaryAmount.value !== '') {
//         start.removeAttribute('disabled');
//     }
// }
// AppData.prototype.start = () => {
//     if (salaryAmount.value === '') {
//         start.setAttribute('disabled', 'true');
//         return;
//     }
//     appData.budget = +salaryAmount.value;

//     appData.getExpenses();
//     appData.getIncome();
//     appData.getExpensesMonth();
//     appData.getAdd.call(appData, additionalExpensesItem.value.split(','), appData.addExpenses);
//     appData.getAdd.call(appData, additionalIncomeItem, appData.addIncome);
//     appData.getInfoDeposit();
//     appData.getBudget();   

//     appData.showResult();  
//     appData.textInputDisabled();
//     appData.startOffCancelOn();             
// };
// AppData.prototype.showResult = () => {
//     budgetMonthValue.value = appData.budgetMonth;
//     budgetDayValue.value = Math.floor(appData.budgetDay);
//     expensesMonthValue.value = appData.expensesMonth;
//     additionalExpensesValue.value = appData.addExpenses.join(', ');
//     additionalIncomeValue.value = appData.addIncome.join(', ');
//     targetMonthValue.value = appData.getTargetMonth();
//     incomePeriodValue.value = appData.calcSavedMoney();
//     periodSelect.addEventListener('input', appData.calcIncomePeriod.bind(appData));
    
// };
// AppData.prototype.addBlock = (items, plus, className) => {
//     const cloneItem = items[0].cloneNode(true);
//     cloneItem.querySelectorAll('input').forEach((item) => {
//         item.value = '';
//     });
//     items[0].parentNode.insertBefore(cloneItem, plus);
//     items = document.querySelectorAll(className);

//     if (items.length === 3) {
//         plus.style.display = 'none';
//     }
    
//     inputsLetters = document.querySelectorAll('input[placeholder="Наименование"]');
//     inputsNumbers = document.querySelectorAll('input[placeholder="Сумма"]');
    
//     inputsNumbers.forEach((item) => {
//         item.addEventListener('keypress', appData.checkNumbers);
//     });
    
//     inputsLetters.forEach((item) => {
//         item.addEventListener('keypress', appData.checkRusLetters);
//     });

// };

// AppData.prototype.checkRusLetters = (e) => {
//     const theEvent = e || window.event;
//     let key = theEvent.keyCode || theEvent.which;
//     key = String.fromCharCode( key );
//     const regex = /[А-яЁё\s\,\.\:\;]/;
//     if( !regex.test(key) ) {
//         theEvent.returnValue = false;
//         if(theEvent.preventDefault) {
//             theEvent.preventDefault();
//         }
//     }
// };
// AppData.prototype.checkNumbers = (e) => {
//     if (e.which < 48 || e.which > 57)
//     {
//         e.preventDefault();
//     }
// };

// AppData.prototype.changePeriod = () => {
//     periodAmount.textContent = periodSelect.value;
// };
// AppData.prototype.calcIncomePeriod = () => {
//     incomePeriodValue.value = appData.calcSavedMoney();
// };
// AppData.prototype.textInputDisabled = () => {
//     const textInputs = document.querySelectorAll('input[type="text"]');
//     textInputs.forEach((item) => {
//         item.disabled = 'disabled';
//     });
//     depositBank.disabled = 'disabled';
// };
// AppData.prototype.startOffCancelOn = () => {
//     start.style.display = 'none';
//     cancel.style.display = 'block';
// };
// AppData.prototype.reset = () => {
//     for (const member in appData) {
//         if (typeof appData[member] === 'number') {
//             appData[member] = 0;
//         } else
//         if (Array.isArray(appData[member])) {
//             appData[member].forEach((item, i, array) => {
//                 delete array[i];
//             });
//             appData[member].length = 0;
//         } else
//         if (typeof appData[member] === 'object') {
//             for (const key in appData[member]) {
//                 delete appData[member][key];
//             }
//         } else if (typeof appData[member] === 'boolean') {
//             appData[member] = false;
//         }
//     }
//     depositCheck.checked = false;
//     depositBank.style.display = 'none';
//     depositAmount.style.display = 'none';
//     depositPercent.style.display = 'none';
//     const incomeForms = document.querySelectorAll('.income-items');
//     for (let i = 1; i <= incomeForms.length - 1; i++){
//         incomeForms[i].remove();
//     }

//     const expensesForms = document.querySelectorAll('.expenses-items');
//     for (let i = 1; i <= expensesForms.length - 1; i++){
//         expensesForms[i].remove();
//     }
//     // console.log(appData);
//     const allInputText = document.querySelectorAll('input[type="text"]');
//     allInputText.forEach((item) => {
//         item.value = '';
//         item.removeAttribute('disabled');
//     });
//     depositBank.removeAttribute('disabled');
//     depositBank.value = 0;

//     const inputRange = document.querySelectorAll('input[type="range"]');
//     inputRange[0].value = '1';
//     periodAmount.textContent = '1';

//     start.style.display = 'block';
//     cancel.style.display = 'none';
// };
// AppData.prototype.getExpenses = () => {
//     expensesItems = document.querySelectorAll('.expenses-items');
//     expensesItems.forEach((item) => {
//         const itemExpenses = item.querySelector('.expenses-title').value;
//         const cashExpenses = item.querySelector('.expenses-amount').value;
//         if (itemExpenses !== '' && cashExpenses !== '') {
//             appData.expenses[itemExpenses] = +cashExpenses;
//         }
//     });
// };
// AppData.prototype.getIncome = () => {
//     incomeItems = document.querySelectorAll('.income-items');
//     incomeItems.forEach((item) => {
//         const itemIncome = item.querySelector('.income-title').value;
//         const cashIncome = item.querySelector('.income-amount').value;
//         if ( itemIncome !== '' && cashIncome !== 0) {
//             appData.income[itemIncome] = +cashIncome;
//         }
//     });

//     for (const key in appData.income) {
//         appData.incomeMonth += +appData.income[key];
//     }
// };
// AppData.prototype.getAdd = (array, objItemsArray ) => {
//     if (array instanceof NodeList) {
//     const arrValues = [];
//     array.forEach((item) => {
//         arrValues.push(item.value.trim());
//     });
//     array = arrValues;
//     }
//     array.forEach((item) => {
//         item = item.trim();
//         if (item !== '') {
//             objItemsArray.push(item);
//         }
//     });
// };
// AppData.prototype.getExpensesMonth = () => {
//     for (const key in appData.expenses) {
//         appData.expensesMonth += +(appData.expenses[key]);
//     }
//     return appData.expensesMonth;
// };
// AppData.prototype.getBudget = () => {
//     appData.budgetMonth = +appData.budget + appData.incomeMonth - appData.expensesMonth + (appData.moneyDeposit * appData.percentDeposit) / 12;
//     appData.budgetDay = appData.budgetMonth / 30;
// }; 
// AppData.prototype.getTargetMonth = () => {
//     return Math.ceil(targetAmount.value / appData.budgetMonth);
// };
// AppData.prototype.getStatusIncome = () => {
//     if (appData.budgetDay >= 800) {
//         console.log('Высокий уровень дохода');
//     } else if (appData.budgetDay >= 300 && appData.budgetDay < 800) {
//         console.log('Средний уровень дохода');
//     } else if ( appData.budgetDay >= 0 && appData.budgetDay < 300) {
//         console.log('Низкий уровень дохода');
//     } else {
//         console.log('Что-то пошло не так');
//     }
// };
// AppData.prototype.getInfoDeposit = () => {
//     if (appData.deposit) {
//         depositPercent.value = depositPercent.value.replace(",", ".");
//         appData.percentDeposit = +depositPercent.value;
//         appData.moneyDeposit = +depositAmount.value;
//         // } while(isNaN(appData.percentDeposit) || appData.percentDeposit <= 0 ||
//         //         appData.percentDeposit === '' || appData.percentDeposit === null);
        
            
//     }
// };
// AppData.prototype.calcSavedMoney = () => {
//     return appData.budgetMonth * periodSelect.value;
// };
// AppData.prototype.changeDepositBlock = () => {
//     if (depositCheck.checked) {
//         depositBank.style.display = 'inline-block';
//         depositAmount.style.display = 'inline-block';
//         appData.deposit = true;
//         depositBank.addEventListener('change', () => {
//             const selectIndex = depositBank.options[depositBank.selectedIndex].value;
//             if (selectIndex === 'other') {
//                 depositPercent.style.display = 'inline-block';
//                 depositPercent.removeAttribute('disabled');
//                 depositPercent.value = '';                
//             } else {
//                 depositPercent.style.display = 'none';
//                 depositPercent.value = selectIndex;
//             }
//         });
//     } else {
//         depositBank.style.display = 'none';
//         depositAmount.style.display = 'none';
//         depositAmount.value = '';
//         appData.deposit = false;
//     }
// };
// AppData.prototype.eventListeners = () => {
//     salaryAmount.addEventListener('keyup', appData.readyToStart);
//     start.addEventListener('click', appData.start.bind(appData));

//     expensesPlus.addEventListener('click', appData.addBlock.bind(appData, expensesItems, expensesPlus, '.expenses-items'));
//     incomePlus.addEventListener('click', appData.addBlock.bind(appData, incomeItems, incomePlus, '.income-items'));
//     periodSelect.addEventListener('input', appData.changePeriod);
//     cancel.addEventListener('click', appData.reset.bind(appData));

//     inputsNumbers.forEach((item) => {
//         item.addEventListener('keypress', appData.checkNumbers);
//     });

//     inputsLetters.forEach((item) => {
//         item.addEventListener('keypress', appData.checkRusLetters);
//     });
//     depositCheck.addEventListener('change', appData.changeDepositBlock.bind(appData));
// };


 