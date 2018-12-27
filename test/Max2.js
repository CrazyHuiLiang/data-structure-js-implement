const max2 = require('../src/Max2');

const unsortedArray = [1, 3, 5, 4, 8, 9, 7, 2, 6, 10, 11, 12, 13, 14, 15];
for (let i = 0; i < 100000000; i++) {
    unsortedArray.push(i);
}

const t1 = Date.now();
const r1 = max2.max2(unsortedArray);
console.log(r1, Date.now() - t1);

const t2 = Date.now();
const r2 = max2.max2_2(unsortedArray, 0, unsortedArray.length - 1);
console.log(r2, Date.now() - t2);
