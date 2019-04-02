const Stack = require('../../src/04_Stack/Stack');
const numberMap = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
const testNum = 2019;

// 将10进制的num转换为positional进制的数
function conversionFrom10(num, positional) {
    let result = '';
    const remainderStack = new Stack;
    while (num !== 0) {
        remainderStack.push(num % positional);
        num = Math.floor(num / positional);
    }
    while (remainderStack.size() !== 0) {
        result += numberMap[remainderStack.pop()];
    }
    return result;
}

// 将positional进制的数num转换为10进制数
function conversionTo10(numString, positional) {
    let num = 0;
    let charIndex = 0;
    do num = num * positional + numberMap.indexOf(numString[charIndex]);
    while (++charIndex < numString.length);
    return num;
}

// 2进制
const binary = conversionFrom10(testNum, 2);
console.log(conversionTo10(binary, 2), binary);

// 8进制
const octal = conversionFrom10(testNum, 8);
console.log(conversionTo10(octal, 8), octal);

// 16进制
const hex = conversionFrom10(testNum, 16);
console.log(conversionTo10(hex, 16), hex);
