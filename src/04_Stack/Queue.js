const {List} = require('../03_List/List');

class Queue extends List {
    // 入队
    enqueue(e) {
        this.insertAsLast(e);
    }

    // 获取最后尾端数据
    rear() {
        return this.last().data;
    }

    // 出队
    dequeue() {
        return this.remove(this.first())
    }

    // 获取首项数据
    front() {
        return this.first().data;
    }
}

module.exports = Queue;
