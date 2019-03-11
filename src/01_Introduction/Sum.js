// 减而治之
function sum(array, n) {
    if (n < 1) {
        return 0;
    }
    return sum(array, n - 1) + array[n - 1];
}
// 分而治之，二分递归
function sum2(array, lo, hi) {
    if (lo === hi) {
        return array[lo];
    }
    let mi = (lo + hi) >> 1;
    return sum2(array, lo, mi) + sum2(array, mi + 1, hi);
}


exports.sum = sum;
exports.sum2 = sum2;
