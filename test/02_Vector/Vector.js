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

// 普通查找，适用于所有的向量
const fi = v.find(800, 0, v.size());
console.log('find', fi, v.get(fi), v.get(fi + 1));

console.log('disordered:', v.disordered());
// v.bubbleSort1();
// v.bubbleSort2();
v.mergeSort(0, v.size());
console.log('disordered:', v.disordered());

// 向量去重
// v.printValues();
v.deduplicate();
v.printValues();

// 有序向量去重
v.uniquify();
v.printValues();

const bfi = v.binSearch(800, 0, v.size());
console.log(bfi, v.get(bfi), v.get(bfi + 1), 'binSearch');

const ffi = v.fibSearch(800, 0, v.size());
console.log(ffi, v.get(ffi), v.get(ffi + 1), 'fibSearch');

const bbfi = v.balanceBinSearch(800, 0, v.size());
console.log(bbfi, v.get(bbfi), v.get(bbfi + 1), 'balanceBinSearch');

const si = v.search(800, 0, v.size());
console.log(si, v.get(si), v.get(si + 1), 'search');

const isi = v.interpolationSearch(800, 0, v.size());
console.log(isi, v.get(isi), v.get(isi + 1), 'interpolationSearch');

// 析构
v.destructor();
