const {
    bubbleSort,
    selectSort,
} = require('../../src/01_Introduction/Sort');

const unsortedArray = [1, 3, 5, 4, 8, 9, 7, 2, 6, 10];

console.log(unsortedArray, bubbleSort(unsortedArray));
console.log(unsortedArray, selectSort(unsortedArray));
