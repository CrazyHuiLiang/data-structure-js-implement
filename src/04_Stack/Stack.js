const Vector = require('../02_Vector');


class Stack extends Vector {
    constructor(props) {
        super(props);

    }

    top() {
        return this.get(this.size() - 1);
    }

    pop() {
        return this.remove(this.size() - 1, 1);
    }

    push(e) {
        this.insert(this.size(), e);
    }
}
