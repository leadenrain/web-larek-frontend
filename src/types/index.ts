// карточка товара
interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

// вид карточки на главной странице
type TProductMain = Pick<
	IProduct,
	'id' | 'image' | 'title' | 'category' | 'price'
>;

// вид карточки в корзине
type TProductBasket = Pick<IProduct, 'id' | 'title' | 'price'>;

// список товаров
interface IProductList {
	total: number;
	items: IProduct[];
}

// корзина
interface IBasket {
	items: TProductBasket[];
	total: number | null;
}

// даные покупателя
interface IContacts {
	email: string;
	phone: string;
	addrress: string;
}

// сформированный заказ
interface IOrder extends IBasket, IContacts {
	payment: string;
}

// данные в модалке "способ оплаты - адрес"
type TOrderPayment = Pick<IOrder, 'payment' | 'addrress'>;

// способ оплаты
type TPaymentMethod = 'cash' | 'card';

// данные в модалке "контакты"
type TOrderContacts = Pick<IOrder, 'email' | 'phone'>;

// заказ - ок
interface IOrderSuccess {
	id: string;
	total: number;
}

// для работы с API
interface ILarekAPI {
	getProduct: (id: string) => Promise<IProduct>;
	getProductList: () => Promise<IProductList>;
	orderItems(order: IOrder): Promise<IOrderSuccess>;
}

// орабражение списка товаров на главной
interface IPage {
	catalog: HTMLElement[];
	counter: number;
}

// модалки
enum Modals {
	product = 'modal:product',
	basket = 'modal:basket',
	payment = 'modal:payment',
	contacts = 'modal:contacts',
	success = 'modal:success',
}

// отображение модалки
interface IModal {
	content: HTMLElement;
}

// отображение формы
interface IForm {
	valid: boolean;
	errors: string[];
}

// стор
type TStateStore = {
	basket: IBasket;
	buyerInfo: IContacts;
};

// состояние модалки для его изменения
type TModalChange = {
	previous: Modals;
	current: Modals;
};
