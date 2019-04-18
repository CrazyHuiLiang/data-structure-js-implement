const Stack = require('../04_Stack/Stack');
const Queue = require('../04_Stack/Queue');

// 节点颜色
const RBColor = {
    RB_RED: 0,
    RB_BLACK: 1,
};

//节点高度（与“空树高度为-1”的约定相统一）
const stature = p => p ? p.height : -1;

// 节点e 相对 节点r的深度
const RelativeDepth = (e, r) => {
    let depth = 0;
    if (!e || !r || e === r) {
        return 0;
    }
    while (e === null || e !== r) {
        e = e.parent;
        depth++;
    }
    return depth;
};

/******************************************************************************************
 * BinNode状态与性质的判断
 ******************************************************************************************/
const IsRoot = x => !x.parent;
const IsLChild = x => !IsRoot(x) && (x === x.parent.lc);
const IsRChild = x => !IsRoot(x) && (x === x.parent.rc);
const HasParent = IsRoot;
const HasLChild = x => !!x.lc;
const HasRChild = x => !!x.rc;
const HasChild = x => HasLChild(x) || HasRChild(x); // 至少拥有一个孩子
const HasBothChild = x => HasLChild(x) && HasRChild(x);// 同时拥有两个孩子
const IsLeaf = x => !HasChild(x);
/******************************************************************************************
 * 与BinNode具有特定关系的节点及指针
 ******************************************************************************************/
// 兄弟
const sibling = p => IsLChild(p) ? p.parent.rc : p.parent.lc;
// 叔叔
const uncle = x => IsLChild(x.parent) ? x.parent.parent.rc : x.parent.parent.lc;
// 来自父亲的引用
const FromParentTo = (x, _root) => IsRoot(x) ? _root : (IsLChild(x) ? x.parent.lc : x.parent.rc);

/******************************************************************************************
 * AVL
 ******************************************************************************************/
const Balanced = x => stature(x.lc) === stature(x.rc); //理想平衡条件
const BalFac = x => stature(x.lc) - stature(x.rc); //平衡因子
const AvlBabanced = x => (-2 < BalFac(x)) && (BalFac(x) < 2); // AVL平衡条件
/******************************************************************************************
 * Red Black
 ******************************************************************************************/
// 外部节点也视作黑节点
const IsBlack = p => (!p || (RBColor.RB_BLACK === p.color));
// 非黑即红
const IsRed = p => !(IsBlack(p));
// RedBlack高度更新条件
const BlackHeightUpdated = x => (
    (stature(x.lc) === stature(x.rc))
    && (x.height === (IsRed(x) ? stature(x.lc) : stature(x.lc) + 1))
);


class BinNode {
    constructor(data, parent = null) {
        this.data = data;
        this.parent = parent;
        this.lc = null;
        this.rc = null;
        this.height = 1;
        this.npl = null; // Null Path Length（左式堆，也可直接用height代替）
        this.color = null; // 颜色（红黑树）
    }

    // 作为左孩子插入新节点
    // return BinNode
    insertAsLC(e) {
        return this.lc = new BinNode(e, this);
    }

    // 作为右孩子插入新节点
    // return BinNode
    insertAsRC(e) {
        return this.rc = new BinNode(e, this);
    }

    // 后代总数，亦即以其为根的子树的规模
    size() {
        let s = 1; // 计入本身
        if (this.lc) {
            s += this.lc.size();
        }
        if (this.rc) {
            s += this.rc.size();
        }
        return s;
    } //O(n)

    toString() {
        let string = '\n';

        // 获取当前树高度为满二叉树时，节点个数
        let size = Math.pow(2, this.height + 1) - 1;
        // 初始化二维矩阵
        let matrix = new Array(this.height + 1);
        for (let i = 0; i < this.height + 1; i++) {
            matrix[i] = new Array(size);
            for (let j = 0; j < size; j++) {
                matrix[i][j] = null;
            }
        }

        //  把树的数据填充进矩阵
        const unVisitQueue = new Queue;
        unVisitQueue.enqueue({
            e: this,
            j: size / 2 >> 0,
        });
        while (!unVisitQueue.empty()) {
            let {e, j} = unVisitQueue.dequeue();
            if (e) {
                const row = RelativeDepth(e, this);
                matrix[row][j] = e.data;
                let nextGap = e.height;
                for (let fillGap = 1; fillGap <= nextGap; fillGap++) {
                    if (HasLChild(e)) matrix[row][j - fillGap] = '-';
                    if (HasRChild(e)) matrix[row][j + fillGap] = '-';
                }
                unVisitQueue.enqueue({
                    e: e.lc,
                    j: j - nextGap
                });
                unVisitQueue.enqueue({
                    e: e.rc,
                    j: j + nextGap
                });
            }
        }

        // 清理空列
        for (let j = 0; j <= size;) {
            let empty = true;
            for (let i = 0; i < matrix.length; i++) {
                if (matrix[i][j] !== null && matrix[i][j] !== '-') {
                    empty = false;
                    break;
                }
            }
            if (empty) {
                for (let i = 0; i < matrix.length; i++) {
                    matrix[i].splice(j, 1);
                }
                size--;
            } else {
                j++;
            }
        }

        // 组装打印字符串
        for (let i = 0; i < matrix.length; i++) {
            string += "|" + i + '|';
            for (let j = 0; j < size; j++) {
                let e = matrix[i][j];
                if (e === '-') {
                    string += '---';
                } else if (e) {
                    string += e.toString().padEnd(3, ' ');
                } else {
                    string += '   ';
                }
            }
            string += "|" + i + '|\n';
        }
        return string;
    }
}

class BinaryTree {
    constructor(data, parent = null) {
        this._size = 0;
        this._root = new BinNode(data, parent);
    }

    // 更新节点x的高度
    _updateHeight(x) {
        return x.height = 1 + Math.max(stature(x.lc), stature(x.rc));
    }

    // 更新x及祖先的高度
    _updateHeightAbove(x) {
        // 可优化： 一旦高度未变，即可终止
        while (x) {
            this._updateHeight(x);
            x = x.parent;
        }
    } // O(n = depth(x))

    // 树根
    root() {
        return this._root;
    }

    // 规模
    size() {
        return this._size;
    }

    // 判空
    empty() {
        return this._size === 0;
    }

    // 将e插入x的左节点处
    insertAsLC(x, e) {
        this._size++;
        x.insertAsLC(e);
        this._updateHeightAbove(x);
        return x.rc;
    }

    // 将e插入x的右节点处
    insertAsRC(x, e) {
        this._size++;
        x.insertAsRC(e);
        this._updateHeightAbove(x);
        return x.rc;
    }

    // (中序遍历意义下)的x的直接后继
    // return BinNode
    succ(x) {
        let s = x; // 记录后继的临时变量
        if (s.rc) { // 若有右孩子，则直接后继必在右子树中，具体就是
            s = s.rc; // 右子树中
            while (s.lc) { // 最小节点
                s = s.lc;
            }
        } else { // 否则，后继应是"将当前节点包含于其左子树中的最低祖先"
            while (IsRChild(s)) {// 跟节点是左是右？
                s = s.parent; // 逆向地沿右向分支，不断朝左上方移动
            }
            s = s.parent; // 最后再朝右上方移动一步，即抵达后继（若存在）
        }
        return s; // 可能是null
    }

    // 二叉树层次遍历
    travLevel(visit) {
        let q = new Queue; // 引入辅助队列
        q.enqueue(this.root()); // 跟节点入队
        while (!q.empty()) { // 在队列再次变空之前，反复迭代
            let x = q.dequeue(); // 取出队首节点，并随即
            visit(x.data); // 访问之
            if (x.lc) {
                q.enqueue(x.lc); // 左孩子入队
            }
            if (x.rc) {
                q.enqueue(x.rc); // 右孩子入队
            }
        }
    }

    // 子树先序遍历
    travPre(x, visit) {
        if (!x) return;
        visit(x.data);
        this.travPre(x.lc, visit);
        this.travPre(x.rc, visit);
    }

    // 子树先序遍历迭代版
    travePre_I1(x, visit) {
        let s = new Stack;
        if (x) s.push(x);
        while (!s.empty()) {
            x = s.pop();
            visit(x.data); // 弹出并访问当前节点
            if (x.rc) {
                s.push(x.rc); // 右孩子先入后出出
            }
            if (x.lc) {
                s.push(x.lc); // 左孩子后入先出
            }
        }
    }

    // 子树先序遍历迭代版2
    travePre_I2(x, visit) {
        let s = new Stack;
        if (x) s.push(x);
        while (!s.empty()) {
            x = s.pop();
            do {
                visit(x.data); // 弹出并访问当前节点
                if (x.rc) {
                    s.push(x.rc); // 右子树入栈
                }
                x = x.lc;
            } while (x);
        }
    }

    // 子树先序遍历迭代版3(版本2的另一种写法)
    travePre_I3(x, visit) {
        function visitAlongLeftBranch(x, visit, s) {
            while (x) { // 反复地
                visit(x.data); // 访问当前节点
                s.push(x.rc); // 右孩子（右子树）入栈（将来逆序出栈）
                x = x.lc; // 沿左侧链下行
            } // 只有右孩子、Null可能入栈（增加判断以剔除后者,是否值得？）
        }

        let s = new Stack; // 辅助栈
        while (true) { // 以（右）子树为单位，逐批访问节点
            visitAlongLeftBranch(x, visit, s); // 访问子树x的左侧链，右子树入栈缓冲
            if (s.empty()) { // 栈空即推出
                break;
            }
            x = s.pop(); // 弹出下一子树的根
        }
    }

    // 子树中序遍历
    travIn(x, visit) {
        if (!x) return;
        this.travIn(x.lc, visit);
        visit(x.data);
        this.travIn(x.rc, visit);
    }

    // 子树中序遍历(迭代版本1)
    travIn_I1(x, visit) {
        function goAlongLeftBranch(x, s) {
            while (x) { // 反复地入栈，沿左分支深入
                s.push(x);
                x = x.lc;
            }
        }

        let s = new Stack; // 辅助栈
        while (true) { // 反复地
            goAlongLeftBranch(x, s); // 从当前节点出发，逐批入栈
            if (s.empty()) { // 直至所有节点处理完毕
                break;
            }
            x = s.pop(); // x的左子树或为空，或已遍历（等效于空），故可以
            visit(x.data); // 立即访问之
            x = x.rc; // 再转向其右子树（可能为空）
        }
    }

    // 子树后序遍历
    travPost(x, visit) {
        if (!x) return;
        this.travPost(x.lc, visit);
        this.travPost(x.rc, visit);
        visit(x.data);
    }

    // 子树后序遍历迭代版
    travPost_I1(x, visit) {
        if (!x) return;
        this.travPost(x.lc, visit);
        this.travPost(x.rc, visit);
        visit(x.data);
    }
}


exports.RBColor = RBColor;
exports.stature = stature;
exports.RelativeDepth = RelativeDepth;

exports.IsRoot = IsRoot;
exports.IsLChild = IsLChild;
exports.IsRChild = IsRChild;

exports.HasParent = HasParent;
exports.HasLChild = HasLChild;
exports.HasRChild = HasRChild;
exports.HasChild = HasChild;
exports.HasBothChild = HasBothChild;
exports.IsLeaf = IsLeaf;

exports.sibling = sibling;
exports.uncle = uncle;
exports.FromParentTo = FromParentTo;

exports.Balanced = Balanced;
exports.BalFac = BalFac;
exports.AvlBabanced = AvlBabanced;

exports.IsBlack = IsBlack;
exports.IsRed = IsRed;
exports.BlackHeightUpdated = BlackHeightUpdated;

exports.BinNode = BinNode;
exports.BinaryTree = BinaryTree;
