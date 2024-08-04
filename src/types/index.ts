import { ApiListResponse } from '../components/base/api';

// API
export interface ILarekAPI {
	getProductList: () => Promise<IProduct[]>;
	// getProduct: (id: string) => Promise<TProduct>;
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

// список товаров
export interface ICatalog {
	products: IProduct[];
	selectedProd: string | null;
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
}

// заказ
export interface IOrder {
	payment: TPaymentMethod;
	address: string;
	email: string;
	phone: string;
	validatePaymentForm: () => boolean;
	validateContactsForm: () => boolean;
}

export type TOrderSuccess = {
	id: string;
	total: number;
};

export type TPaymentMethod = 'cash' | 'card';
// данные в модалке "способ оплаты - адрес"
export type TOrderPayment = Pick<IOrder, 'payment' | 'address'>;

// данные в модалке "контакты"
export type TOrderContacts = Pick<IOrder, 'email' | 'phone'>;

// тип данных заказа
export type TOrder = TOrderPayment & TOrderContacts & ApiListResponse<IProduct>;

// тип для ошибок валидации
export type TOrderErrors<T> = Partial<Record<keyof T, string>>;
