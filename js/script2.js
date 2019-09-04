let num = 266219;
let str = String(num);
let len = str.length;

let multiplyResult = str[0];
for (let i = 1; i < len; i++) {
    multiplyResult *= str[i];
}
console.log('Произведение цифр числа ' + num + ' = ' + multiplyResult);

let resPow3 = multiplyResult ** 3;

console.log( (String(resPow3)).slice(0, 2) );

