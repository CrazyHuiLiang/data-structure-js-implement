function max2(array) {
    let m1 = array[0];
    let m2 = array[1];
    if (m1 < m2) {
        const _ = m1;
        m1 = m2;
        m2 = _;
    }
    for (let i = 2; i < array.length; i++) {
        if (m2 < array[i]) {
            m2 = array[i];
            if (m1 < m2) {
                const _ = m1;
                m1 = m2;
                m2 = _;
            }
        }
    }
    return [m1, m2];
}

function max2_2(array, lo, hi) {
    if (lo + 1 === hi) {
        let m1 = Math.max(array[lo], array[hi]);
        let m2 = Math.min(array[lo], array[hi]);
        return [m1, m2];
    }

    if (lo + 2 === hi) {
        let m1 = Math.max(array[lo], array[lo + 1]);
        let m2 = Math.max(array[lo], array[lo + 1]);
        if (m2 < array[lo + 2]) {
            m2 = array[lo + 2];
            if (m1 < m2) {
                const _ = m1;
                m1 = m2;
                m2 = _;
            }
        }
        return [m1, m2];
    }

    const mi = Math.floor((lo + hi) / 2);
    const l = max2_2(array, lo, mi);
    const r = max2_2(array, mi, hi);
    const result = [];
    if (l[0] > r[0]) {
        result.push(l[0]);
        result.push(Math.max(l[1], r[0]));
    } else {
        result.push(r[0]);
        result.push(Math.max(l[0], r[1]));
    }
    return result;
}

exports.max2 = max2;
exports.max2_2 = max2_2;
