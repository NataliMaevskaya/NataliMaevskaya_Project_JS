'use strict';

let books = document.querySelectorAll('.books');
let book = document.querySelectorAll('.book');

// Порядок книг
books[0].appendChild(book[2]);
let tmpBook = books[0].removeChild(book[1]);
books[0].insertBefore(tmpBook, book[0]);
tmpBook = books[0].removeChild(book[3]);
books[0].insertBefore(tmpBook, book[5]);

// изменить изображение
let body = document.getElementsByTagName('body');
body[0].setAttribute('style', 'background-image: url(./image/you-dont-know-js.jpg)');

// Исправить заголовок Книги 3
book[4].querySelector('a').textContent = "Книга 3. this и Прототипы Объектов";

// Удалить рекламу
body[0].removeChild(body[0].querySelector('.adv'));

// Книга 2 - Порядок глав
let ul2 = book[0].querySelectorAll('ul');
let list2 = ul2[0].querySelectorAll('li');

let tmpItem = ul2[0].removeChild(list2[2]); // Приложение С
ul2[0].insertBefore(tmpItem, list2[10]);

tmpItem = ul2[0].removeChild(list2[6]); // Глава 2
ul2[0].insertBefore(tmpItem, list2[4]);

tmpItem = ul2[0].removeChild(list2[8]); // Глава 3
ul2[0].insertBefore(tmpItem, list2[4]);

// Книга 5 - Порядок глав
let ul5 = book[5].querySelectorAll('ul');
let list5 = ul5[0].querySelectorAll('li');
console.log('list5: ', list5[9]);

tmpItem = ul5[0].removeChild(list5[9]); // Глава 1
ul5[0].insertBefore(tmpItem, list5[2]);

tmpItem = ul5[0].removeChild(list5[2]); // Глава 4
ul5[0].insertBefore(tmpItem, list5[5]);

tmpItem = ul5[0].removeChild(list5[5]); // Приложение А
ul5[0].insertBefore(tmpItem, list5[8]);

// Книга 6 - Добавить Главу 8
let ul6 = book[2].querySelectorAll('ul');
let list6 = ul6[0].querySelectorAll('li');

let newElem = document.createElement('li');
newElem.textContent = 'Глава 8: За пределами ES6';
ul6[0].insertBefore(newElem, list6[9]);

