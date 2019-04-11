const Vector = require('../02_Vector/Vector');
const Queue = require('../04_Stack/Queue');
const VStatus = {
    UNDISCOVERED: 0, // 未发现
    DISCOVERED: 1, // 已发现
    VISITED: 2, // 已访问
};
const EStatus = {
    UNDETERMINED: 0, // 未定
    TREE: 1, // 树边
    CROSS: 2, // 跨边
    FORWARD: 3, // 前向边
    BACKWARD: 4,// 回边
};

class Vertex {
    constructor(data) {
        this.data = data; // 数据
        this.inDegree = 0; // 出度
        this.outDegree = 0;// 入度

        this.status = VStatus.UNDISCOVERED; // 状态
        this.dTime = -1; // 时间标签
        this.fTime = -1;
        this.parent = -1; // 在遍历树中的父节点
        this.priority = Infinity; // 在遍历树中的优先级（最短通路，极短跨边）
    }
}

class Edge {
    constructor(d, w) {
        this.data = d; // 0代表不存在边，1代表有边
        this.weight = w;

        this.status = EStatus.UNDETERMINED;
    }
}

// 父类，虚类
class Graph { // 顶点类型、边类型
    // 顶点操作
    // 边操作
    // 图算法： 无论如何实现，接口必须统一
}

class GraphMatrix extends Graph {
    // vs: 顶点数组（顶点的值），数组元素不可为空
    // es: 边数组，{i: 尾顶点, j: 头顶点, w: 权重}
    constructor(vs, es) {
        super();
        this.n = vs.length;
        this.e = es.length;

        //顶点集(Vector[]) 顶点所构成的向量
        this.V = new Vector(this.n);
        // 填充顶点集的初始化数据
        for (let i = 0; i < this.n; i++) {
            this.V.insert(i, new Vertex(vs[i]));
        }

        // 边集(Vector[][]<Edge>) 由一组边构成的向量，进而由这组向量构成的向量|二维向量|邻接向量
        this.E = new Vector(this.n);
        for (let i = 0; i < this.n; i++) {
            this.E.insert(i, new Vector(this.n)); // 初始化边向量的向量
        }
        // 初始化边集
        for (let i = 0; i < this.n; i++) {
            let eVector = this.E.get(i);
            for (let j = 0; j < this.n; j++) {
                eVector.insert(j, new Edge(0, 0));
            }
        }
        // 填充边集的初始化数据
        for (let ei = 0; ei < this.e; ei++) {
            const {i, j, w} = es[ei];
            const edge = this.E.get(i).get(j);
            edge.data = 1;
            edge.w = w;
        }
    }

    // 所有顶点、边的辅助信息复位
    _reset() {
        for (let i = 0; i < this.n; i++) {
            // 顶点
            this.setVStatus(i, VStatus.UNDISCOVERED);
            this.setVDTime(i, -1);
            this.setVFTime(i, -1);
            this.setVParent(i, -1);
            this.setVPriority(i, Infinity);

            // 边
            for (let j = 0; j < this.n; j++) {
                if (this.eExists(i, j)) {
                    this.setEStatus(i, j, EStatus.UNDETERMINED);
                }
            }
        }
    }

// 顶点操作
    // 顶点数据
    vertex(i) {
        if (this.V.get(i)) {
            return this.V.get(i).data;
        }
    }

    // 入度
    vInDegree(i) {
        return this.V.get(i).inDegree;
    }

    setVIndegree(i, inDegree) {
        this.V.get(i).inDegree = inDegree;
    }

    // 出度
    vOutDegree(i) {
        return this.V.get(i).outDegree;
    }

    setVOutDegree(i, outDegree) {
        return this.V.get(i).outDegree = outDegree;
    }

    // 状态
    vStatus(i) {
        return this.V.get(i).status;
    }

    setVStatus(i, status) {
        return this.V.get(i).status = status;
    }

    // 时间标签dTime
    vDTime(i) {
        return this.V.get(i).dTime;
    }

    setVDTime(i, dTime) {
        return this.V.get(i).dTime = dTime;
    }

    // 时间标签fTime
    vFTime(i) {
        return this.V.get(i).fTime;
    }

    setVFTime(i, fTime) {
        return this.V.get(i).fTime = fTime;
    }

    // 在遍历树中的父亲
    vParent(i) {
        return this.V.get(i).parent;
    }

    setVParent(i, parent) {
        return this.V.get(i).parent = parent;
    }

    // 优先级数
    vPriority(i) {
        return this.V.get(i).priority;
    }

    setVPriority(i, priority) {
        return this.V.get(i).priority = priority;
    }

    // 获取第i个顶点的第一个有效的邻居
    vFirstNbr(i) {
        return this.vNextNbr(i, this.n);
    }

    // 对于任意顶点i，枚举其所有领接顶点neighbor
    // 若已枚举至邻居j，则转向下一邻居
    vNextNbr(i, j) {
        while ((-1 < j) && !this.eExists(i, --j)) ; // 逆向顺序查找, O(n)
        return j;
    } // 改用邻接表可提高至O（1+outDegree(i)）

    // 插入顶点，返回编号
    // vertex：顶点data
    vInsert(vertex) {
        // 当前矩阵后添加一列
        for (let j = 0; j < this.n; j++) {
            this.E.get(j).insert(this.n, new Edge(0, 0));
        }

        const row = new Vector(this.n + 1);
        for (let i = 0; i <= this.n; i++) {
            row.insert(i, new Edge(0, 0));
        }

        this.E.insert(this.n, row);
        return this.V.insert(this.n++, new Vertex(vertex));
    }

    // 删除顶点及其关联边，返回该顶点信息
    vRemove(i) {
        // 删除所有出边
        for (let j = 0; j < this.n; j++) {
            if (this.eExists(i, j)) {
                this.V.get(j).inDegree--;
            }
        }
        // 删除第i行
        this.E.remove(i, i + 1);
        this.n--;
        // 删除所有入边及第i列
        for (let j = 0; j < this.n; j++) {

            if (this.eExists(j, i)) {
                this.V.get(j).outDegree--;
            }
            this.E.get(j).remove(i, i + 1);
        }

        // 备份顶点i的信息
        const vBak = this.vertex(i);
        // 删除顶点i
        this.V.remove(i, i + 1);
        // 返回被删除顶点的信息
        return vBak;
    }

// 边操作
    // 边(i, j)的数据
    edge(i, j) {
        return this.E.get(i).get(j).data;
    } // O(1)

    setEdge(i, j, data) {
        return this.E.get(i).get(j).data = data;
    }

    // 边(i, j)的状态
    eStatus(i, j) {
        return this.E.get(i).get(j).status;
    }

    setEStatus(i, j, status) {
        return this.E.get(i).get(j).status = status;
    }

    // 边(i, j)的权重
    eWeight(i, j) {
        return this.E.get(i).get(j).weight;
    }

    setEWeight(i, j, weight) {
        return this.E.get(i).get(j).weight = weight;
    }

    // 判断边(i, j)是否存在
    eExists(i, j) {
        return (0 <= i) && (i < this.n)
            && (0 <= j) && (j < this.n)
            && this.E.get(i).get(j).data !== 0; //短路求值
    }

    // 插入（i, j, w）
    eInsert(edge, w, i, j) {
        if (this.eExists(i, j)) {
            return; // 忽略已有的边
        }

        this.E.get(i).put(j, new Edge(edge, w)); // 创建新边
        this.e++; // 更新边计数
        this.V.get(i).outDegree++; // 更新关联顶点i的出度
        this.V.get(j).inDegree++; // 更新关联顶点j的入度
    }

    // 删除顶点i和j之间的联边（eExists(i, j)）
    eRemove(i, j) {
        const eBak = this.edge(i, j); // 备份边(i, j)的信息
        this.setEdge(i, j, 0); // 删除边(i, j)
        this.e--; // 更新边计数
        this.V.get(i).outDegree--;// 更新关联顶点i的出度
        this.V.get(j).inDegree--;// 更新关联顶点j的入度
        return eBak; // 返回被删除边的信息
    }

    // 销毁所有边
    // deleteAllEdge() { // TODO
    //     for (let j = 0; j < this.n; j++) {
    //
    //         for (let k = 0; k < this.n; k++) {
    //             this.E.get(j).get(k).data = 0; // 清除所有动态申请的边记录
    //         }
    //     }
    // }

// 算法
    // 广度优先搜索（Breadth-First-Search)
    BFS(v, clock) {
        // 初始化
        let Q = new Queue;
        this.setVStatus(v, VStatus.DISCOVERED);
        Q.enqueue(v);
        while (!Q.empty()) {
            // 取出首节点，并
            let v = Q.dequeue();
            this.setVDTime(v, ++clock);
            // 考察v的每一邻居u
            for (let u = this.vFirstNbr(v); -1 < u; u = this.vNextNbr(v, u)) {
                if (VStatus.UNDISCOVERED === this.vStatus(u)) {// 若u尚未被发现，则
                    this.setVStatus(u, VStatus.DISCOVERED); // 发现该顶点
                    Q.enqueue(u);
                    this.setEStatus(v, u, EStatus.TREE); // 引入树边
                    this.setVParent(u, v);
                } else { // 若u已被发现（正在队列中），或者甚至已访问完毕（已出队列），则
                    this.setEStatus(v, u, EStatus.CROSS); // 将（v， u）归类于跨边
                }
            }

            console.log(this.vertex(v)); // 访问
            this.setVStatus(v, VStatus.VISITED);
        }
        return clock;
    }

    bfs(s) { // s为起始顶点
        this._reset();
        let clock = 0;
        let v = s; // 初始化
        do { // 逐一检查所有顶点，一旦遇到尚未发现的顶点
            if (VStatus.UNDISCOVERED === this.vStatus(v)) {
                clock = this.BFS(v, clock); // 即从该顶点出发启动一次BFS
            }

        } while (s !== (v = (++v % this.n))) ;
    }

    // 深度优先搜索
    DFS(v, clock) {
        // 发现当前节点v
        this.setVDTime(v, ++clock);
        this.setVStatus(v, VStatus.DISCOVERED);
        for (let u = this.vFirstNbr(v); -1 < u; u = this.vNextNbr(v, u)) { // 枚举v的每一邻居u
            switch (this.vStatus(u)) { // 并视其状态分别处理
                case VStatus.UNDISCOVERED: // u尚未发现，意味着支撑树可在此拓展
                    this.setEStatus(v, u, EStatus.TREE);
                    this.setVParent(u, v);
                    this.DFS(u, clock); // 递归
                    break;
                case VStatus.DISCOVERED:  // u已被发现但尚未访问完毕，应属被后代指向的祖先
                    this.setEStatus(v, u, EStatus.BACKWARD);
                    break;
                default: // u已访问完毕（VISITED,有向图）,则视承袭关系分别为前向边或跨边
                    this.setEStatus(v, u, this.vDTime(v) < this.vDTime(u) ? EStatus.FORWARD : EStatus.CROSS);
                    break;
            }
        }
        console.log(this.vertex(v));
        this.setVStatus(v, VStatus.VISITED);
        this.setVFTime(v, ++clock);
        return clock;
    }

    // 深度优先遍历
    dfs(s) {// s为起始顶点
        this._reset();
        let clock = 0;
        let v = s;
        do {
            if (VStatus.UNDISCOVERED === this.vStatus(v)) {
                clock = this.DFS(v, clock); // 即从该顶点出发启动一次DFS
            }
        } while (s !== (v = (++v % this.n)));
    }

    // 打印图
    printValue() {
        // 构造节点的打印字符串
        let vString = '';
        this.V.traverse((e, i) => {
            vString += this.vertex(i) + '\t';
        });
        console.log('\t' + vString + '\n');

        let eString = '';
        this.E.traverse((eVector, i) => {
            eString += this.vertex(i) + '\t';
            eVector.traverse((e, j) => {
                eString += e.data + '\t';
            });
            eString += '\n';
        });
        console.log(eString);
    }
}

module.exports = {
    Vertex,
    Edge,
    GraphMatrix,
};
