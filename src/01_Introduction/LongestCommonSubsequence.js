// 最长子序列
// 递归
function lcs(A, B) {
    // 1. 如果两个字符串中有一个为空，则最长子序列长度也必然为0
    if (A.length === 0 || B.length === 0) {
        return 0;
    }
    // 如果两个字符串的最后一位是相同的，我们可以将两个字符串的最后一位都切除掉，然后求解两个子串的最大子序列长度，最后在求解两个子串的最大子序列的长度的结果上加1。
    // 减而治之
    if (A[A.length - 1] === B[B.length - 1]) {
        A = A.substr(0, A.length - 1);
        B = B.substr(0, A.length - 1);
        return lcs(A, B) + 1;
    }
    // 如果两个字符串都不是空串，而且最后一位都不为相同，这时候可以分两种情况讨论，第一种情况是A串的最后一位对最后结果没有贡献，直接舍去A串的最后一位，然后求解舍去最后一位字符的A与B的最长子序列长度。对应的第二种情况是，假设B的最后一位对最后结果没有贡献，这时候直接舍去B的最后一位，然后继续求解A，B的最长子序列。最后的正确结果就是这两种可能情况所得出的结果最大者。
    // 分而治之
    const decreaseALength = lcs(A.substr(0, A.length - 1), B);
    const decreaseBLength = lcs(A, B.substr(0, B.length - 1));
    return Math.max(decreaseALength, decreaseBLength);
}

// 改为迭代
// 动态规划，消除重复计算，提高效率
/*

将A，B两个
将整个计算过程

将递归改为递推，将求解过程使用表格（这里是二维数组）记录下来，消减重复计算
使用A来做纵轴，B做横轴，会组成一个二维数组，二维数组内容初始化为0
使用B的每列的字符和A的每一行的字符进行对比，如果对比结果相同，则取二维数组左上方数字加一作为当前二维数组元素的值，
如果不相同，取数组中当前位置的左边一项和上边一项的较大数字作为当前二维数组元素的值，计算从左向右，从上向下进行，所以整个计算过程是安全的。
最终计算到数组右下方时得到的值就是最终结果的解。
*/
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
