export const addCategoryKey = category => {
    category.key = category.id;
    category.title = category.name;
    if (category.children) {
        for (let c of category.children) {
            addCategoryKey(c);
        }
    }
};
