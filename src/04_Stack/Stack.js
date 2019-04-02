const Vector = require('../02_Vector/Vector');

class Stack extends Vector {
    push(e) {
        this.insert(this.size(), e);
    }

    top() {
        return this.get(this.size() - 1);
    }

    pop() {
        const topElement = this.top();
        this.remove(this.size() - 1, this.size());
        return topElement;
    }
}

module.exports = Stack;
