const {fib, fib2} = require('../../src/01_Introduction/Fib');

const num = 40;
console.group('fib1');
for (let i = 0; i < num; i++) {
    console.log(i, fib(i));
}
console.groupEnd();

console.group('fib2');
for (let i = 0; i < num; i++) {
    console.log(i, fib2(i));
}
console.groupEnd();
