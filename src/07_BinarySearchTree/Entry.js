// 词条模版类
class Entry {
    constructor(key, value) {
        this.key = key; // 关键值
        this.value = value; // 数值(除关键码外的其他数据)
    }

// 比较器、判断器(从此，不必严格区分词条及其对应的关键码)
    // 小于
    operatorSmallerThen(e) {
        return this.key < e.key;
    }

    // 大于
    operatorBiggerThen(e) {
        return this.key > e.key;
    }

    // 等于
    operatorEqualWith(e) {
        return this.key === e.key;
    }

    // 不等
    operatorUnequalWith(e) {
        return this.key !== e.key;
    }
}
