const {BST} = require('../../src/07_BinarySearchTree/BST');

const bst = new BST(100);
bst.insert(50);
bst.insert(150);
bst.insert(30);
bst.insert(40);
bst.insert(120);
bst.insert(135);
bst.insert(200);
bst.insert(220);
bst.insert(210);
bst.insert(260);
bst.insert(230);
bst.insert(240);
bst.insert(245);
bst.insert(249);
bst.insert(247);
bst.insert(900);
console.log(bst._root.toString());
console.log(bst._root.height);
console.log(bst.remove(900));
console.log(bst.remove(249));
console.log(bst.remove(230));
console.log(bst.remove(220));
console.log(bst._root.toString());