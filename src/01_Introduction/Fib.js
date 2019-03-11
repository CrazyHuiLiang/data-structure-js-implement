// 递归
// 斐波那契数列：0, 1, 1, 2, 3, 5, 8,
function fib(n) {
    if (n < 2) {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
}

// 迭代，memoization
// 斐波那契数列：0, 1, 1, 2, 3, 5, 8,
function fib2(n) {
    if (n < 2) {
        return n;
    }
    let f = 0, g = 1; // fib(0),fib(1)
    while (1 < n--) {
        g = g + f;
        f = g - f;
    }
    return g;
}


exports.fib = fib;
exports.fib2 = fib2;
