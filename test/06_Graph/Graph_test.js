const {GraphMatrix} = require('../../src/06_Graph/Graph');

// 用做初始化的顶点和边
const vs = [1, 2, 3, 4, 5];
const es = [
    {
        i: 0,
        j: 1,
        w: 1,
    },
    {
        i: 0,
        j: 2,
        w: 1,
    },
    {
        i: 1,
        j: 3,
        w: 1,
    },
    {
        i: 2,
        j: 4,
        w: 1,
    },
    {
        i: 3,
        j: 0,
        w: 1,
    },
    {
        i: 4,
        j: 3,
        w: 1,
    },
];

const graph = new GraphMatrix(vs, es);
graph.printValue();

console.log('第一个顶点：', graph.vertex(0));
let firstN = graph.vFirstNbr(0);
console.log('第一个顶点的第一个邻居下标：', firstN);
let secondN = graph.vNextNbr(0, firstN);
console.log('第一个顶点的第二个邻居下标：', secondN);
let thirdN = graph.vNextNbr(0, secondN);
console.log('第一个顶点的第三个邻居下标：', thirdN);
console.log('1 -> 2', graph.eExists(0, 1));
console.log('2 -> 1', graph.eExists(1, 2));
console.log('已有的边数：', graph.e);
graph.printValue();

graph.eInsert(1, 1, 4, 0);
console.log('已有的边数：', graph.e);
graph.printValue();

graph.eRemove(4, 0);
console.log('已有的边数：', graph.e);
graph.printValue();

console.log('已有顶点个数：', graph.n);

console.log('插入新顶点下标：', graph.vInsert(6));
console.log('插入新顶点下标：', graph.vInsert(7));
console.log('已有顶点个数：', graph.n);
console.log('已有的边数：', graph.e);
graph.printValue();

// console.log('移除下标为5的顶点', graph.vRemove(5));
// graph.printValue();
// console.log('移除下标为5的顶点', graph.vRemove(5));
// graph.printValue();

// graph.deleteAllEdge();

// graph.BFS(0, 0);
// graph.bfs(0);

// graph.DFS(0, 0);
// graph.dfs(0);
