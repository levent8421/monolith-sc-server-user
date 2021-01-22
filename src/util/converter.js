import {differenceStates, refreshReasons, slotStates, weightStates} from '../context/metaData';

export const addCategoryKey = category => {
    category.key = category.id;
    category.title = category.name;
    if (category.children) {
        for (let c of category.children) {
            addCategoryKey(c);
        }
    }
};
const slotStateCodeStringTable = {};
for (let state of slotStates) {
    slotStateCodeStringTable[state.code] = state.name;
}
export const asSlotStateString = code => {
    if (slotStateCodeStringTable.hasOwnProperty(code)) {
        return slotStateCodeStringTable[code];
    }
    return `Unknown[${code}]`;
};
const weightStateCodeStringTable = {};
for (const state of weightStates) {
    weightStateCodeStringTable[state.code] = state.name;
}
export const asWeightStateString = code => {
    if (weightStateCodeStringTable.hasOwnProperty(code)) {
        return weightStateCodeStringTable[code];
    }
    return `Unknown[${code}]`;
};
const differenceStateCodeStringTable = {};
for (const state of differenceStates) {
    differenceStateCodeStringTable[state.code] = state.name;
}
export const asDifferenceStateString = code => {
    if (differenceStateCodeStringTable.hasOwnProperty(code)) {
        return differenceStateCodeStringTable[code];
    }
    return `Unknown[${code}]`;
};
const refreshReasonCodeStringTable = {};
for (const reason of refreshReasons) {
    refreshReasonCodeStringTable[reason.reason] = reason.name;
}
export const asRefreshReasonString = reason => {
    if (refreshReasonCodeStringTable.hasOwnProperty(reason)) {
        return refreshReasonCodeStringTable[reason];
    }
    return `Unknown[${reason}]`;
};
