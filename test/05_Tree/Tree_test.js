const {BinaryTree} = require('../../src/05_Tree/Tree');
const Stack = require('../../src/04_Stack/Stack');


const tree = new BinaryTree();
const root = tree.root();
root.data = 0;

tree.insertAsLC(root, 1);
tree.insertAsRC(root, 2);
tree.insertAsLC(root.lc, 3);
tree.insertAsRC(root.lc, 4);
tree.insertAsLC(root.rc, 5);
tree.insertAsRC(root.rc, 6);
console.log('root:', tree.root().data);
console.log('size:', tree.size());

let printStack;

function collect(e) {
    printStack.push(e);
}

console.log('层次遍历');
printStack = new Stack;
tree.travLevel(collect);
printStack.printValues();

console.log('先序遍历');
printStack = new Stack;
tree.travPre(root, collect);
printStack.printValues();

printStack = new Stack;
tree.travePre_I1(root, collect);
printStack.printValues();

printStack = new Stack;
tree.travePre_I2(root, collect);
printStack.printValues();

printStack = new Stack;
tree.travePre_I3(root, collect);
printStack.printValues();

console.log('中序遍历');
printStack = new Stack;
tree.travIn(root, collect);
printStack.printValues();

printStack = new Stack;
tree.travIn_I1(root, collect);
printStack.printValues();

console.log('后序遍历');
printStack = new Stack;
tree.travPost(root, collect);
printStack.printValues();
