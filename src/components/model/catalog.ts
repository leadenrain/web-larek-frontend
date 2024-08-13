import { IProduct, ICatalog } from '../../types';
import { IEvents } from '../base/events';

export class Catalog implements ICatalog {
	protected _products: IProduct[] = [];
	protected _selectedProductId: IProduct['id'] = null;

	constructor(protected events: IEvents) {}

	set products(products: IProduct[]) {
		this._products = products;
		this.events.emit<IProduct[]>('catalog:get', products);
	}

	set selectedProductId(productId: IProduct['id']) {
		const selectedProduct = this.getProduct(productId);
		if (selectedProduct) {
			this._selectedProductId = productId;
			this.events.emit<Pick<IProduct, 'id'>>('fullCard:change', {
				id: productId,
			});
		} else {
			throw new Error(`Product with ID ${productId} not found`);
		}
	}

	getProduct(productId: string) {
		return this._products.find((item) => item.id === productId);
	}
}
