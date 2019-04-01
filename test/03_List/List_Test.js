const {List} = require('../../src/03_List/List');
let testNum = 9;

// 实例化列表
const tempList = new List();

// 插入元素
for (let i = 0; i < 90; i++) {
    const randomNum = Math.round(Math.random() * 100);
    tempList.insertAsFirst(randomNum);
    tempList.insertAsLast(randomNum);
}
tempList.printValues();


const list = new List();
list.copyNodes(tempList.first(), 50);
list.printValues();
console.log(`find ${testNum}:\t`, list.find(testNum, list.size(), list.last()));
list.insertAsFirst(1);
list.insertAsLast(666);
list.insertBefore(list.first().succ, 2);
list.insertAfter(list.last().pred, 555);
console.log(list.size());
console.log('first\t', list.first().data);
console.log('last\t', list.last().data);
list.printValues();
list.remove(list.first().succ);
list.remove(list.last().pred);
list.printValues();

console.log('disordered:', list.disordered());
list.selectionSort(list.first(), list.size());
list.insertionSort(list.first(), list.size());
console.log('disordered:', list.disordered());
console.log(`search ${testNum}:\t`, list.search(testNum, list.size(), list.last()));

list.printValues();
list.deduplicate();
list.printValues();
list.uniquify();
list.printValues();
