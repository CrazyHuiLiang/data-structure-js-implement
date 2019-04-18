const {
    BinNode,
    BinaryTree,

    IsLChild,
    IsRChild,

    HasLChild,
    HasRChild,
} = require('../05_Tree/Tree');
const TreeBranch = {
    L: 0,
    R: 1,
};

class BST extends BinaryTree {
    constructor(...props) {
        super(...props);
        this._hot = null; //命中节点的父亲
        this._branch = TreeBranch.L; // 查找命中hot的左分支还是右分支（查找值小于hot，还是大于等于hot）
    }

    // 查找
    /* virtual */
    search(e) {
        this._hot = null;
        return this.searchIn(this._root, e);
    }

    // 典型的尾递归，可改为迭代版
    /*
        v: 当前（子）树根
        e: 目标关键码
        &hot: 记忆热点，查找成功时，指向一个关键码为e且真实存在的节点，失败时，指向最后一次试图转向的空节点null
              失败时，不妨假想地将此空节点，转换为一个数值为e的邵明节点。
              无论成功与否：返回值总是等效地指向命中节点，而_hot总是指向命中节点的父亲
    */
    searchIn(v, e) {
        if (!v || (e === v.data)) {
            return v; // 足以确定失败、成功，或者
        }
        this._hot = v; // 先记下当前（非空）节点，然后再。。。
        if (e < v.data) {
            v = v.lc;
            this._branch = TreeBranch.L;
        } else {
            v = v.rc;
            this._branch = TreeBranch.R;
        }
        return this.searchIn(v, e);
    } // 运行时间正比于返回节点v的深度，不超过树高O(h)

    // 插入
    /* virtual */
    insert(e) {
        let x = this.search(e); // 查找目标（留意_hot的设置）
        if (!x) { // 即禁止雷同元素，故仅在查找失败时才实施插入操作
            // 在x处创建新节点，以_hot为父亲
            if (this._branch === TreeBranch.L) {
                x = this._hot.insertAsLC(e);
            } else {
                x = this._hot.insertAsRC(e);
            }
            this._size++; // 更新全树规模，更新x及其历代祖先的高度
            this._updateHeightAbove(x);
        }
        return x; // 无论e是否存在原树中，至此总有x.data == e
    }// 验证： 对于首个节点插入之类的边界情况，均可正确处理

    // 删除
    /* virtual */
    remove(e) {
        let x = this.search(e);// 定位目标节点
        if (!x) return false; // 确认目标存在（此时_hot为x的父亲）
        this.removeAt(x, this._hot); // 分两大类情况实施删除，更新全树规模
        this._size--; // 更新全树规模
        this._updateHeightAbove(this._hot); // 更新_hot及其历代祖先的高度
        return true;
    } // 删除成功与否，由返回值指示

    removeAt(x) {
        let w = x; // 实际被摘除的节点，初值同x
        let succ = null; // 实际被删除节点的接替者
        if (!HasLChild(x)) {// 左子树为空
            if (IsLChild(x)) { // 实际被删元素的父亲指向接替元素
                w.parent.lc = x.rc;
            } else {
                w.parent.rc = x.rc;
            }

            succ = x = x.rc;
        } else if (!x.rc) {// 右子树为空
            if (IsLChild(x)) { // 实际被删元素的父亲指向接替元素
                w.parent.lc = x.lc;
            } else {
                w.parent.rc = x.lc;
            }
            succ = x = x.lc;
        } else { // 左右子树并存的情况，则
            // 令*x与其后继*w互换数据
            w = this.succ(w);
            const temp = x.data;
            x.data = w.data;
            w.data = temp;

            let u = w.parent; // 原问题即转化为，摘除非二度的节点w
            succ = w.rc;
            if (u === x) {
                u.rc = succ;
            } else {
                u.lc = succ;
            }
        }
        this._hot = w.parent; // 记录实际被删除节点的父亲
        if (succ) succ.parent = this._hot; // 将被删除节点的接替者与hot相联
        return succ; // 返回接替者
    }// 此类情况仅需O（1）的时间

    // 3 + 4 重构
    /*
        BinNodePosi(t), BinNodePosi(t), BinNodePosi(t),
        BinNodePosi(t), BinNodePosi(t), BinNodePosi(t), BinNodePosi(t);
    */
    connect34() {

    }

    // 旋转调整
    rotateAt(t) {

    }
}

exports.BST = BST;
