// 起泡排序，从前向后，相邻元素两两对比，较大的元素交换到后面
// 不变性： 经过k轮扫描后，最大的元素必然就位
// 单调性： 经过k轮扫描交换后，问题规模缩减至n-k
// 正确性： 经过至多n趟扫描后，算法必然终止，且能给出正确解答
// 算法复杂度： n^2
exports.bubbleSort = function (array) {
    const list = Array.from(array);
    let n = list.length;
    for (let sorted = false; !sorted; n--) {
        sorted = true;
        for (let i = 1; i < n; i++) {
            if (list[i - 1] > list[i]) {
                const _ = list[i];
                list[i] = list[i - 1];
                list[i - 1] = _;
                sorted = false;
            }
        }
    }
    return list;
};


// 选择排序
exports.selectSort = function (array) {
    const list = Array.from(array);
    for (let i = list.length; 0 <= i; i--) {
        for (let j = i; 0 <= j; j--) {
            if (list[i] < list[j]) {
                const _ = list[i];
                list[i] = list[j];
                list[j] = _;
            }
        }
    }
    return list;
};



