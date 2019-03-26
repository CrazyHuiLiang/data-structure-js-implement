const DEFAULT_CAPACITY = 30;

class Vector {

    constructor(capacity = DEFAULT_CAPACITY) {
        this._size = 0;
        this._capacity = capacity;
        this._vector = new Array(capacity);
    }

    // 从数组中复制
    copyFrom(array, lo, hi) {
        this._vector = new Array(this._capacity = 2 * (hi - lo));
        this._size = 0;
        while (lo < hi) {
            this._vector[this._size++] = array[lo++];
        }
    }

    // 向量空间不足时扩容
    // 动态空间分配
    expand() {
        if (this._size < this._capacity) return; // 尚未满员，不必扩容
        this._capacity = Math.max(this._capacity, DEFAULT_CAPACITY); // 不低于最小容量
        const oldVector = this._vector;
        this._vector = new Array(this._capacity <<= 1); //容量加倍
        for (let i = 0; i < this._size; i++) { //复制原向量内容
            this._vector[i] = oldVector[i];
        }
    }

    // 向量空间填充因子不足时，缩容
    // 动态空间分配
    shrink() {
        if (this._capacity / 2 < this._size) return; // 使用率大于50%，不必缩容
        this._capacity = Math.max(this._capacity >>= 1, DEFAULT_CAPACITY); // 不低于最小容量
        const oldVector = this._vector;
        this._vector = new Array(this._capacity); //容量缩容
        for (let i = 0; i < this._size; i++) { //复制原向量内容
            this._vector[i] = oldVector[i];
        }
    }

    // 析构函数
    destructor() {
        this._size = null;
        this._capacity = null;
        this._vector = null;
    }

    /*
    * 报告向量当前的规模（元素总数）
    * 适用对象：向量
    */
    size() {
        return this._size;
    }

    /*
    * 获取秩为r的元素
    * 适用对象：向量
    */
    get(r) {
        return this._vector[r];
    }

    // 打印value
    printValues() {
        let valueS = '';
        this.traverse(e => valueS += e + ' ');
        console.log(this.size(), 'item`s values: ', valueS);
    }

    /*
    * 用e替换秩为r元素的数值
    * 适用对象：向量
    */
    put(r, e) {
        this._vector[r] = e;
    }

    /*
    * e作为秩为r元素插入，原后继元素依次后移
    * 适用对象：向量
    */
    insert(r, e) {
        this.expand();
        for (let i = this.size(); r < i; i--) {
            this.put(i, this.get(i - 1));
        }
        this._vector[r] = e;
        this._size++;
        return r; // 返回秩
    }

    /*
    * 删除秩为r的元素，返回被删除元素的数目
    * 适用对象：向量
    */
    remove(l, h) {
        if (h <= l) {
            return 0; // 出于效率考虑，单独处理退化情况
        }
        while (h < this._size) {
            this.put(l++, this.get(h++));
        }
        this._size = l;
        this.shrink();
        return h - l;
    }

    /*
    * 判断所有元素是否已按非降序排序
    * 适用对象：向量
    */
    disordered() {
        for (let i = 1; i < this.size(); i++) {
            if (this.get(i - 1) > this.get(i)) {
                return false;
            }
        }
        return true;
    }

    /*
    * 调整各元素的位置，使之按非降序排序
    * 适用对象：向量
    */
    sort() {

    }

    // 冒泡排序
    bubbleSort1() {
        let l = 0;
        let h = this.size();

        const bubble = (l, h) => {
            let sorted = true; // 整体有序标志
            while (++l < h) { // 自左向右，逐一检查个对相邻元素
                if (this.get(l - 1) > this.get(l)) { // 若逆序，则
                    sorted = false; // 意味着尚未整体有序，并需要
                    // 交换
                    const t = this.get(l - 1);
                    this.put(l - 1, this.get(l));
                    this.put(l, t);
                }
            }
            return sorted;
        };

        while (!bubble(l, h--)) ; //逐趟做扫描交换，直至全叙
    }

    // 冒泡排序（比较排序）
    bubbleSort2() {
        let l = 0;
        let h = this.size();

        const bubble = (l, h) => {
            let last = l; // 最右侧的逆序对初始化为[l -1, lo]
            while (++l < h) { // 自左向右，逐一检查个对相邻元素
                if (this.get(l - 1) > this.get(l)) { // 若逆序，则
                    last = l; // 更新最右侧逆序对位置记录，并
                    // 交换
                    const t = this.get(l - 1);
                    this.put(l - 1, this.get(l));
                    this.put(l, t);
                }
            }
            return last;
        };

        while (l < (h = bubble(l, h))) ; //逐趟做扫描交换，直至全叙
    }

    // 归并排序（分治策略）
    _merge(l, m, h) {
        const headVector = new Vector(m - l);
        for (let i = 0; i < m - l; i++) {
            headVector.insert(i, this.get(l + i));
        }
        for (let i = 0, j = m; i < headVector.size();) {
            if (h <= j || headVector.get(i) < this.get(j)) {
                this.put(l++, headVector.get(i++));
            } else {
                this.put(l++, this.get(j++));
            }
        }
    }

    mergeSort(l, h) {
        if (h - l < 2) {
            return;
        }
        const m = (l + h) >> 1;
        this.mergeSort(l, m);
        this.mergeSort(m, h);
        this._merge(l, m, h);
    }

    /*
    * 查找目标元素e
    * 适用对象：向量
    * T 为可判等的基本类型
    */
    find(e, l, h) {
        // 在命中多个元素时可返回秩最大者
        while (l < h--) {
            if (e === this.get(h)) { // 逆向查找
                return h;
            }
        }
        return h; // h < l 意味着失败，否则h即命中元素的秩
        // 输入敏感（input-sensitive）：最好O(1),最差O(n)
    }


    // 二分查找（时间复杂度：1.5log n）
    // * 适用对象：有序向量
    // * T 为可比较的基本类型
    binSearch(e, l, h) {
        while (l < h) { // 每步迭代可能要做两次比较判断，有三个分支
            const mi = (l + h) >> 1; // 以中点为轴点
            if (e < this.get(mi)) h = mi; //深入前半段[l, mi)继续查找
            else if (this.get(mi) < e) l = mi + 1; // 深入后半段(mi, hi)
            else return mi; // 在mi处命中
        }
        return -1; //查找失败
    }

    // 斐波那契查找（时间复杂度：1.44 log n）
    // 二分查找版本转向左、右分支前的关键码（比较次数）不等，而（递归深度）却相同
    // 若能通过（递归深度）的不平衡，对（转向成本）的不平衡进行补偿，平均查找长度应能进一步缩短
    // * 适用对象：有序向量
    // * T 为可比较的基本类型
    fibSearch(e, l, h) {
        while (l < h) { // 每步迭代可能要做两次比较判断，有三个分支
            const mi = Math.floor((h - l) * 0.618) + l; // 以黄金分割点为轴点,斐波那契中间项就是位于前一项与后一项的黄金分割点上
            if (e < this.get(mi)) h = mi; //深入前半段[l, mi)继续查找
            else if (this.get(mi) < e) l = mi + 1; // 深入后半段(mi, hi)
            else return mi; // 在mi处命中
        }
        return -1; //查找失败
    }

    // 平衡二分查找（时间复杂度：1.5log n）
    // * 适用对象：有序向量
    // * T 为可比较的基本类型
    balanceBinSearch(e, l, h) {
        while (1 < h - l) { // 每步迭代可能要做两次比较判断，有三个分支
            const mi = (l + h) >> 1; // 以中点为轴点
            if (e < this.get(mi)) h = mi; //深入前半段[l, mi)继续查找
            else l = mi; // 深入后半段[mi, hi)
        }
        return (e === this.get(l)) ? l : -1; //返回命中元素的秩或者-1
    } // 相对与binSearch，最好（坏）情况下最坏（好）；各种情况下的SL更加接近，整体性能更趋稳定

    /*
    * 查找目标元素e，返回不大于e且秩最大的元素
    * 适用对象：有序向量
    * T 为可比较的基本类型
    */
    search(e, l, h) {
        // binSearch
        // fibSearch
        // balanceBinSearch
        /*
            以上三种查找算法都没有严格的兑现search（）接口的语义约定，返回不大于e的最后一个元素
            只有兑现这一约定，才可有效支持相关算法，比如: V.insert(1 + V.search(e), e);
            1. 当有多个命中元素时，必须返回最靠后（秩最大）者
            2. 失败时，应返回小于e的最大者（含哨兵[lo - 1]）
        */
        // 在balanceBinSearch版本上稍作修改即可满足语义
        while (l < h) { // 不变性：A[0, l) <= e < A[h, n)
            let mi = (l + h) >> 1; //以中点为轴点，经比较后确定深入
            e < this.get(mi) ? h = mi : l = mi + 1; // [l, mi) 或 (mi, hi)
        } // 出口时，A[l = h]为大于e的最小元素
        return --l; // 故l - 1即不大于e的元素的最大秩
    }

    // 插值查找
    // 当元素均匀且独立的随机分布时，确定切分点时采用的时近似的插值估算的方法
    // mi ~= lo + (hi - lo)*(e - A[lo])/(A[hi] - A[lo])
    // 平均情况：每经过一次比较，n缩至√n
    interpolationSearch(e, l, h) {
        while (l < h) { // 不变性：A[0, l) <= e < A[h, n)
            let mi = Math.floor(l + (h - l) * (e - this.get(l)) / (this.get(h) - this.get(l))); // 求导？
            if (mi < l) { // 如果middle判定为视野之外的数据，则终止循环（未找到或--l就是命中元素）
                break;
            }
            if (e < this.get(mi)) {
                h = mi; // [l, mi)
            } else {
                l = mi + 1; // (mi, hi)
            }
        } // 出口时，A[l = h]为大于e的最小元素
        return --l; // 故l - 1即不大于e的元素的最大秩
    }

    /*
    * 剔除重复元素
    * 适用对象：向量
    */
    deduplicate() {
        const oldSize = this._size;
        let i = 1;
        while (i < this.size()) {
            this.find(this.get(i), 0, i) < 0 ? i++ : this.remove(i, i + 1);
        }
        return oldSize - this._size;

        // O(n^2)
        // 1. 仿照uniquify()高效版的思路，元素移动的次数可以降至O(n),但比较次数依然是O(n^2);而且稳定性将被破坏
        // 2. 先对需删除的重复元素做标记，然后再统一删除，稳定性保持，但因查找长度更长，从而导致更多的对比操作
        // 3. V.sort().uniquify(): 简明实现最优的O(nlogn)
    }

    /*
    * 剔除重复元素
    * 适用对象：有序向量
    */
    uniquify() {
        let cursor = 0;
        let i = 0;
        let string = '';
        while (i++ < this.size()) {
            if (this.get(cursor) !== this.get(i)) {
                string += this.get(i) + ' ';
                this.put(++cursor, this.get(i));
            }
        }
        this._size = cursor + 1;
        this.shrink();
        return i - cursor;
    }

    /*
    * 遍历向量并统一处理所有元素，处理方法由函数对象指定
    * 适用对象：向量
    */
    traverse(visit) {
        for (let i = 0; i < this._size; i++) {
            visit(this.get(i), i);
        }
    }
}

module.exports = Vector;
