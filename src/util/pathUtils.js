export const formatSearch = search => {
    if (!search) {
        return {};
    }
    const pairStr = search.substring(1);
    if (!pairStr) {
        return {};
    }
    const pairs = pairStr.split('&');
    const res = {};
    for (let pair of pairs) {
        const pArr = pair.split('=');
        if (pArr.length < 2) {
            continue;
        }
        const name = pArr[0];
        const value = pArr[1];
        if (name in res) {
            const oldValues = res[name];
            if (typeof (oldValues) === 'string') {
                const values = [];
                values.push(oldValues);
                values.push(value);
                res[name] = values;
            } else {
                oldValues.push(value);
            }
        } else {
            res[name] = value;
        }
    }
    return res;
};
