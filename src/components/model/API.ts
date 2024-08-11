import { ILarekAPI, TOrderSuccess, IProduct, TOrder } from '../../types';
import { Api, ApiListResponse } from '../base/api';

export class WebLarekAPI extends Api implements ILarekAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options: RequestInit = {}) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) => {
			return data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}));
		});
	}

	postOrder(order: TOrder): Promise<TOrderSuccess> {
		return this.post('/order', order).then((data: TOrderSuccess) => data);
	}
}

// getProduct(id: string) {
// 	return this.get(`/product/${id}`).then((item: IProduct) => item);
// }
