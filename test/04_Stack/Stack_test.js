const Stack = require('../../src/04_Stack/Stack');

const stack = new Stack(100);
for (let i = 0; i < 30; i++) {
    stack.push(Math.round(Math.random() * 100));
}

stack.printValues();
console.log('the top of stack:', stack.top());
for (let i = 0; i < stack.size(); i++) {
    console.log('\tpop', stack.pop());
}
stack.printValues();

