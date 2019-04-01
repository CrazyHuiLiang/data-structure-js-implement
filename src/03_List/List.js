class ListNode { // 列表节点模版类（以双向链表形式实现）
    constructor(pred = null, data = null, succ = null) {
        this.pred = pred; // 前驱
        this.data = data; // 数值
        this.succ = succ; // 后继
    }

    // 前插入
    insertAsPred(e) {
        const x = new ListNode(this.pred, e, this);
        this.pred.succ = x;
        this.pred = x;
        return x;
    }

    // 后插入
    insertAsSucc(e) {
        const x = new ListNode(this, e, this.succ);
        this.succ.pred = x;
        this.succ = x;
        return x;
    }
}

class List {
    constructor() {
        this.header = new ListNode(); // 创建头哨兵节点
        this.trailer = new ListNode(); // 创建尾哨兵节点
        this.header.succ = this.trailer; // 互联
        this.trailer.pred = this.header; // 互联
        this._size = 0;// 记录规模
    }

    // 从p中拷贝n个节点
    copyNodes(p, n) {
        while (n--) {
            this.insertAsLast(p.data);
            p = p.succ;
        }
    }


    // 报告列表当前的规模（节点总数）
    size() {
        return this._size;
    }

    // 返回首节点
    first() {
        return this.header.succ;
    }

    // 返回末节点
    last() {
        return this.trailer.pred;
    }

    // 将e当作首节点插入
    insertAsFirst(e) {
        this._size++;
        return this.header.insertAsSucc(e);
    }

    // 将e当作末节点插入
    insertAsLast(e) {
        this._size++;
        return this.trailer.insertAsPred(e);
    }

    // 将e当作节点p的直接前驱插入
    insertBefore(p, e) {
        this._size++;
        return p.insertAsPred(e);
    }

    // 将e当作节点p的直接后继插入
    insertAfter(p, e) {
        this._size++;
        return p.insertAsSucc(e);
    }

    // 删除位置p处的节点，返回其引用
    remove(p) {
        p.pred.succ = p.succ;
        p.succ.pred = p.pred;
        this._size--;
        return p.data;
    }

    // 判断各节点是否已按非降序排列
    disordered() {
        let listnode = this.first();
        while ((listnode = listnode.succ) !== this.trailer) {
            if (listnode.data < listnode.pred.data) {
                return false;
            }
        }
        return true;
    }

    // 调整各节点的位置，使之按非降序排序
    sort() {

    }

    // 选择排序: 对列表中起始于位置p的连续n个元素做选择排序，
    // n^2
    selectionSort(p, n) {
        function selectMax(p, n) {
            let max = p; // 最大者暂定为p
            for (let cur = p; 1 < n; n--) {
                if (max.data <= (cur = cur.succ).data) {
                    max = cur;
                }
            }
            return max;
        }

        // 待排序区间(head, tail)
        let head = p.pred;
        let tail = p;
        for (let i = 0; i < n; i++) {
            tail = tail.succ;
        }
        while (1 < n) { // 反复从（非平凡的）待排序区间内找出最大者，并移至有序区间前端
            this.insertBefore(tail, this.remove(selectMax(head.succ, n)));
            // 待排序区间，有序区间的范围，均同步更新
            tail = tail.pred;
            n--;
        }
    }

    // 插入排序
    // 对列表中起始于位置p的连续n个元素做插入排序
    insertionSort(p, n) {
        for (let r = 0; r < n; r++) { // 逐一引入各节点，由S[r]得到S[r+1]
            this.insertAfter(this.search(p.data, r, p), p.data); // 查找+插入
            // 转向下一节点
            p = p.succ;
            this.remove(p.pred);
        } // n次迭代，每次O(r + 1)
    } // 仅使用O(1)辅助空间，属于就地算法


    // 查找末表元素e，失败时返回null
    find(e, n, p) {
        while (0 < n--) {
            if (e === (p = p.pred).data) {
                return p;
            }
        }
        return null;
    }

    // 查找e，返回不大于e且秩最大的节点
    // 适用对象： 有序列表
    search(e, n, p) {
        while (0 < n--) {
            if ((p = p.pred).data <= e) {
                break;
            }
        }
        return p;
    }

    // 剔除重复节点
    deduplicate() {
        // 平凡列表自然无重复
        if (this._size < 2) {
            return 0;
        }
        const oldSize = this._size;
        let p = this.first(); // p从首节点起
        let r = 1;
        while (this.trailer !== (p = p.succ)) {
            const waitRemove = this.find(p.data, r, p);
            if (waitRemove) {
                this.remove(waitRemove);
            } else {
                r++;
            }
        }
        return oldSize - this._size;
    } // O(n^2)

    // 剔除重复节点
    // 有序列表
    uniquify() {
        // 平凡列表自然无重复
        if (this._size < 2) {
            return 0;
        }
        const oldSize = this._size;
        let p = this.first(); // p为各区段起点
        let q; // q为其后继
        while (this.trailer !== (q = p.succ)) { //反复考查紧邻的节点对(p, q)
            if (p.data !== q.data) { // 若互异，则转向下一区段
                p = q;
            } else { // 否则（雷同）,删除后者
                this.remove(q);
            }
        }
        return oldSize - this._size;
    }// 只需遍历整个列表一趟，O(n)

    // 遍历列表
    traverse(visit) {
        let listnode = this.header;
        while (listnode.succ !== this.trailer) {
            visit(listnode = listnode.succ);
        }
    }

    // 打印值
    printValues() {
        let elements = 'size: (' + this.size() + ')\t';
        this.traverse(e => {
            elements += e.data + ' ';
        });
        console.log(elements);
    }
}

module.exports = {
    List,
};
