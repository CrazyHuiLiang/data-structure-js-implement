const Queue = require('../../src/04_Stack/Queue');

const queue = new Queue;

for (let i = 0; i < 20; i++) {
    queue.enqueue(Math.round(Math.random() * 100));
}

console.log(queue.size());
queue.printValues();

for (let i = 0; i < 5; i++) {
    console.log('\tdequeue', queue.dequeue());
}

queue.printValues();
console.log('front\t', queue.front());
console.log('rear\t', queue.rear());
