import { IBasket, IProduct } from '../../types';
import { IEvents } from '../base/events';

export class Basket implements IBasket {
	protected _items: IProduct[] = [];

	constructor(protected events: IEvents) {}

	addProduct(item: IProduct) {
		this._items = [...this._items, item];
		this.events.emit('basket:change', {
			products: this._items,
		});
	}

	removeProduct(productId: string) {
		this._items = this._items.filter(({ id }) => id !== productId);
		if (this.isEmpty()) {
			this.events.emit('basket:removedAllProducts');
		}
		this.events.emit('basket:change', {
			products: this._items,
		});
	}

	clear() {
		this._items = [];
	}

	isInBasket(productId: string) {
		return this._items.some((item) => item.id === productId);
	}

	getTotal() {
		return this._items.reduce((total, item) => total + item.price, 0);
	}

	getCount() {
		return this._items.length;
	}

	getItemsIds() {
		return this.items.map((item) => item.id);
	}

	private isEmpty() {
		return this._items.length === 0;
	}

	get items() {
		return this._items;
	}
}
