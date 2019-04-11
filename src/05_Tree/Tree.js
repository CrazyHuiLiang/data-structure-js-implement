// class Tree {
//     // 根节点
//     root() {
//
//     }
//
//     // 父节点
//     parent() {
//
//     }
//
//     // 长子
//     firstChild() {
//
//     }
//
//     // 兄弟
//     nextSibling() {
//
//     }
//
//     // 将e作为第i个孩子插入
//     insert(i, e) {
//
//     }
//
//     // 删除第i个孩子（及其后代）
//     remove(i) {
//
//     }
//
//     // 遍历
//     traverse(visit) {
//
//     }
// }

const Stack = require('../04_Stack/Stack');
const Queue = require('../04_Stack/Queue');

// 获取节点高度的'宏定义'
function stature(p) {
    if (p) {
        return p.height;
    }
    return -1;
}

class BinNode {
    constructor(data, parent = null) {
        this.data = data;
        this.parent = parent;
        this.lChild = null;
        this.rChild = null;
        this.height = 0;
        // this.npl = null;
        // this.color = null;
    }

    // 作为左孩子插入新节点
    // return BinNode
    insertAsLC(e) {
        return this.lChild = new BinNode(e, this);
    }

    // 作为右孩子插入新节点
    // return BinNode
    insertAsRC(e) {
        return this.rChild = new BinNode(e, this);
    }

    // 后代总数，亦即以其为根的子树的规模
    size() {
        let s = 1; // 计入本身
        if (this.lChild) {
            s += this.lChild.size();
        }
        if (this.rChild) {
            s += this.rChild.size();
        }
        return s;
    } //O(n)
}

class BinaryTree {
    constructor() {
        this._size = 0;
        this._root = new BinNode();
    }

    // 更新节点x的高度
    _updateHeight(x) {
        return x.height = 1 + Math.max(stature(x.lChild), stature(x.rChild));
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
        return x.rChild;
    }

    // 将e插入x的右节点处
    insertAsRC(x, e) {
        this._size++;
        x.insertAsRC(e);
        this._updateHeightAbove(x);
        return x.rChild;
    }

    // (中序遍历意义下)当前节点的直接后继
    // return BinNode
    succ() {

    }

    // 二叉树层次遍历
    travLevel(visit) {
        let q = new Queue; // 引入辅助队列
        q.enqueue(this.root()); // 跟节点入队
        while (!q.empty()) { // 在队列再次变空之前，反复迭代
            let x = q.dequeue(); // 取出队首节点，并随即
            visit(x.data); // 访问之
            if (x.lChild) {
                q.enqueue(x.lChild); // 左孩子入队
            }
            if (x.rChild) {
                q.enqueue(x.rChild); // 右孩子入队
            }
        }
    }

    // 子树先序遍历
    travPre(x, visit) {
        if (!x) return;
        visit(x.data);
        this.travPre(x.lChild, visit);
        this.travPre(x.rChild, visit);
    }

    // 子树先序遍历迭代版
    travePre_I1(x, visit) {
        let s = new Stack;
        if (x) s.push(x);
        while (!s.empty()) {
            x = s.pop();
            visit(x.data); // 弹出并访问当前节点
            if (x.rChild) {
                s.push(x.rChild); // 右孩子先入后出出
            }
            if (x.lChild) {
                s.push(x.lChild); // 左孩子后入先出
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
                if (x.rChild) {
                    s.push(x.rChild); // 右子树入栈
                }
                x = x.lChild;
            } while (x);
        }
    }

    // 子树先序遍历迭代版3(版本2的另一种写法)
    travePre_I3(x, visit) {
        function visitAlongLeftBranch(x, visit, s) {
            while (x) { // 反复地
                visit(x.data); // 访问当前节点
                s.push(x.rChild); // 右孩子（右子树）入栈（将来逆序出栈）
                x = x.lChild; // 沿左侧链下行
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
        this.travIn(x.lChild, visit);
        visit(x.data);
        this.travIn(x.rChild, visit);
    }

    // 子树中序遍历(迭代版本1)
    travIn_I1(x, visit) {
        function goAlongLeftBranch(x, s) {
            while (x) { // 反复地入栈，沿左分支深入
                s.push(x);
                x = x.lChild;
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
            x = x.rChild; // 再转向其右子树（可能为空）
        }
    }

    // 子树后序遍历
    travPost(x, visit) {
        if (!x) return;
        this.travPost(x.lChild, visit);
        this.travPost(x.rChild, visit);
        visit(x.data);
    }
    // 子树后序遍历迭代版
    travPost_I1(x, visit) {
        if (!x) return;
        this.travPost(x.lChild, visit);
        this.travPost(x.rChild, visit);
        visit(x.data);
    }
}

module.exports = BinaryTree;
