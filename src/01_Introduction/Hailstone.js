/* 序列Hailstone（n）
{
   1 : n<= 1
   Hailstone(n/2) : n偶
   Hailstone（3n + 1）： n奇
}
*/


function hailstone(n) { // 计算序列Hailstone（n）的长度
    let length = 1;
    while (1 < n) {
        (n % 2) ? n = 3 * n + 1 : n /= 2;
        length++;
    }
    return length;
}


exports.hailstone = hailstone;
