import uniqid from "uniqid";

// Shopping list class
export default class List {
	constructor() {
		this.items = [];
	}

	// the same properties as our data structure
	addItem(count, unit, ingredient) {
		const item = {
			id: uniqid(),
			count,
			unit,
			ingredient,
		};
		this.items.push(item);
		return item;
	}

	deleteItem(id) {
		const index = this.items.findIndex((el) => el.id === id);
		this.items.splice(index, 1);
	}

	updateCount(id, newCount) {
		// find the item element with id equal to the id we pass in
		this.items.find(el => el.id === id).count = newCount;
	}
}
