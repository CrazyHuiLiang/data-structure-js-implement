const {
    sum,
    sum2,
} = require('../src/Sum');


const unsortedArray = [1, 3, 5, 4, 8, 9, 7, 2, 6, 10];
console.log(sum(unsortedArray, unsortedArray.length));
console.log(sum2(unsortedArray, 0, unsortedArray.length-1));
