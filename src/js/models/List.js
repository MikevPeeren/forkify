import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    };

    getItem(id) {
        return this.items.find(element => element.id === id);
    };

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);

        return item;
    };

    deleteItem(id) {
        const index = this.items.findIndex(element => element.id === id);
        // [2,4,8] splice(1, 1) -> return 4, original array is [2,8]
        // [2,4,8] slice(1, 2) -> return 4, original array is [2,4,8]
        this.items.splice(index, 1);
    };

    updateCount(id, newCount) {
        this.items.find(element => element.id === id).count = newCount;
    };
}