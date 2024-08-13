import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { WebLarekAPI } from './services/API';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement } from './utils/utils';
import { CatalogView } from './components/view/catalogView';
import { ModalView } from './components/view/modalView';
import { BasketView, CartView } from './components/view/basketView';
import { Catalog } from './components/model/catalog';
import { Basket } from './components/model/basket';
import { Form } from './components/model/form';
import {
	ProductBasketView,
	ProductCatalogView,
	ProductFullView,
} from './components/view/productView';
import { IProduct, TPaymentMethod, TOrderForm, TContactsForm } from './types';
import { ContactsFormView, OrderFormView } from './components/view/formView';
import { SuccessView } from './components/view/successView';

const cartContainer = ensureElement<HTMLButtonElement>('.header__basket');
const catalogContainer = ensureElement<HTMLElement>('.gallery');
const modalContainer = ensureElement<HTMLDivElement>('#modal-container');

const productCatalogTemplate =
	ensureElement<HTMLTemplateElement>('#card-catalog');

const productModalTemplate =
	ensureElement<HTMLTemplateElement>('#card-preview');
const productBasketTemplate =
	ensureElement<HTMLTemplateElement>('#card-basket');

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');

const formPaymentTemplate = ensureElement<HTMLTemplateElement>('#order');
const formContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const orderSuccessTemplate = ensureElement<HTMLTemplateElement>('#success');

const API = new WebLarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();

const catalog = new Catalog(events);
const basket = new Basket(events);
const form = new Form(events);

const cartView = new CartView(cartContainer, events);
const catalogView = new CatalogView(catalogContainer, events);
const basketView = new BasketView(basketTemplate, events);
const modalView = new ModalView(modalContainer, events);
const contactsFormView = new ContactsFormView(formContactsTemplate, events);
const orderFormView = new OrderFormView(formPaymentTemplate, events);
const successView = new SuccessView(orderSuccessTemplate, events);

events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// получение данных в модель каталога
API.getProductList()
	.then((products) => {
		catalog.products = products;
	})
	.catch((error) => {
		console.log(error);
	});

// вывод каталога
events.on<IProduct[]>('catalog:get', (products) => {
	const productsHTML = products.map((product: IProduct) => {
		const productView = new ProductCatalogView(productCatalogTemplate, events);
		return productView.render(product);
	});

	catalogView.products = productsHTML;
});

// передача id выбраной карточки в модель каталога
events.on<Pick<IProduct, 'id'>>('product:select', ({ id }) => {
	catalog.selectedProductId = id;
});

// вывод модалки с полным описанием товара
events.on<Pick<IProduct, 'id'>>('fullCard:change', ({ id }) => {
	const product = catalog.getProduct(id);
	const state = basket.isInBasket(id);
	const productFullView = new ProductFullView(productModalTemplate, events);
	productFullView.button = state;
	modalView.content = productFullView.render(product);
	modalView.open();
});

// добавление товара в корзину
events.on<Pick<IProduct, 'id'>>('basket:addProduct', ({ id }) => {
	const product = catalog.getProduct(id);
	basket.addProduct(product);
});

// удаление товара из корзины
events.on<Pick<IProduct, 'id'>>('basket:removeProduct', ({ id }) => {
	basket.removeProduct(id);
});

// закрытие пустой корзины
events.on('basket:removedAllProducts', () => {
	modalView.close();
});

// открытие модалки с корзиной
events.on<{ products: IProduct[] }>('basket:change', ({ products }) => {
	const productsHTML = products.map((product, index) => {
		const productBasketView = new ProductBasketView(
			productBasketTemplate,
			events
		);
		productBasketView.index = index + 1;
		return productBasketView.render(product) as HTMLLIElement;
	});
	basketView.items = productsHTML;
	basketView.toggleButton(false);
	basketView.total = basket.getTotal();
	cartView.counter = basket.getCount();
	modalView.content = basketView.render();
});

// открытие корзины по клику на иконке
events.on('basket:open', () => {
	const productsHTML = basket.items.map((product) => {
		const productBasketView = new ProductBasketView(
			productBasketTemplate,
			events
		);
		return productBasketView.render(product) as HTMLLIElement;
	});
	basketView.items = productsHTML;
	basketView.total = basket.getTotal();
	modalView.content = basketView.render();
	modalView.open();
});

// открытие пустой корзины
events.on('basket:isEmpty', () => {
	basketView.toggleButton(true);
	modalView.content = basketView.render();
});

// вывод формы для заполнения
events.on('order:start', () => {
	form.payment = 'card';
	orderFormView.clear();
	contactsFormView.clear();
	modalView.content = orderFormView.render();
	modalView.render();
});

// выбран способ оплаты
events.on<{ payment: TPaymentMethod }>('payment:select', ({ payment }) => {
	form.payment = payment;
});

// вывод ошибок в форме
events.on<{ error: string }>('form:error', ({ error }) => {
	orderFormView.submit = true;
	orderFormView.error = error;
	contactsFormView.submit = true;
	contactsFormView.error = error;
});

events.on('form:valid', () => {
	orderFormView.submit = false;
	orderFormView.error = '';
	contactsFormView.submit = false;
	contactsFormView.error = '';
});

// изменения в полях формы
events.on(
	'orderInput:change',
	(data: { field: keyof TOrderForm; value: string }) => {
		form.updateOrderFields(data.field, data.value);
	}
);

events.on(
	`contactsInput:change`,
	(data: { field: keyof TContactsForm; value: string }) => {
		form.updateContactsFields(data.field, data.value);
	}
);

// переход к форме Контакты
events.on('form:next', () => {
	modalView.content = contactsFormView.render();
	modalView.render();
});

// завершение заказа
events.on('order:ready', () => {
	const order = {
		...form.buyerData,
		total: basket.getTotal(),
		items: basket.itemsIds,
	};
	API.postOrder(order)
		.then((data) => {
			basket.clear();
			form.clear();
			cartView.counter = basket.items.length;
			successView.message = data.total;
			modalView.content = successView.render();
		})
		.catch((error) => {
			console.log(error);
		});
});

events.on('order:success', () => modalView.close());
