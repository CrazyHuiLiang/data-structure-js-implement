const Vector = require('../../src/02_Vector/Vector');

const array = new Array(100);
for (let i = 0; i < 50; i++) {
    array[i] = Math.round(100 * Math.random());
}

// 初始化向量，从数组中向向量中复制值
const v = new Vector(100);
v.copyFrom(array, 0, 50);
// console.log('size', v.size());
// v.printValues();

// 插入值
for (let i = v.size(); i < 1000; i++) {
    v.insert(i, Math.round(10000 * Math.random()));
}
// v.printValues();

// 设置值
v.put(8, 800);

// console.log('removed size', v.remove(40, 50));
// v.printValues();

console.log('disordered:', v.disordered());
// v.bubbleSort1();
// v.bubbleSort2();
v.mergeSort(0, v.size());
console.log('disordered:', v.disordered());
// v.printValues();
// console.log(v.fibSearch(5, 0, v.size()));


// 析构
v.destructor();
