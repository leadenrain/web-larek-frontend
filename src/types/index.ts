// API
export interface ILarekAPI {
	getProductList: () => Promise<IProduct[]>;
	postOrder: (order: TOrder) => Promise<TOrderSuccess>;
}

// карточка товара
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

// каталог
export interface ICatalog {
	products: IProduct[];
	selectedProductId: string | null;
	getProduct: (id: string) => IProduct;
}

// корзина
export interface IBasket {
	items: IProduct[];
	addProduct: (item: IProduct) => void;
	removeProduct: (id: string) => void;
	clear: () => void;
	isInBasket: (id: string) => boolean;
	getTotal: () => number;
	getCount: () => number;
	getItemsIds: () => string[];
}

// формы
export interface IForm {
	payment: TPaymentMethod;
	address: string;
	email: string;
	phone: string;
	updateOrderFields: (field: keyof TOrder, value: string) => void;
	updateContactsFields: (field: keyof TOrder, value: string) => void;
	checkValidityOrder: () => string | true;
	checkValidityContacts: () => string | true;
	clear: () => void;
}

// тип успешного заказа
export type TOrderSuccess = {
	id: string;
	total: number;
};

export type TPaymentMethod = 'cash' | 'card';

export type TOrder = {
	address: string;
	email: string;
	phone: string;
};

export type TEvents = {
	id: string;
	products: IProduct[];
	payment: TPaymentMethod;
	field: keyof TOrder;
	value: string;
	error: string;
};
