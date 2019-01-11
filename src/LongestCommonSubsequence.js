// 最长子序列
// 递归
function lcs(A, B) {
    if (A.length === 0 || B.length === 0) {
        return 0;
    }
    if (A[A.length - 1] === B[B.length - 1]) {
        A = A.substr(0, A.length - 1);
        B = B.substr(0, A.length - 1);
        return lcs(A, B) + 1;
    }

    const decreaseALength = lcs(A.substr(0, A.length - 1), B);
    const decreaseBLength = lcs(A, B.substr(0, B.length - 1));
    return Math.max(decreaseALength, decreaseBLength);
}

// 改为迭代
// 动态规划，消除重复计算
function lcs2(A, B) {
    const map = new Array(A.length + 1);
    // init map
    for (let i = 0; i < map.length; i++) {
        map[i] = new Array(B.length + 1).fill(0);
    }
    for (let i = 1; i < A.length + 1; i++) {
        const a = A[i - 1];
        for (let j = 1; j < B.length + 1; j++) {
            const b = B[j - 1];
            if (a === b) {
                map[i][j] = map[i - 1][j - 1] + 1;
            } else {
                map[i][j] = Math.max(map[i - 1][j], map[i][j - 1]);
            }
        }
    }
    return map[A.length][B.length];
}

exports.lcs = lcs;
exports.lcs2 = lcs2;
