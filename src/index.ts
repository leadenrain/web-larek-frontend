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
import { IProduct, TEvents } from './types';
import { ContactsFormView, OrderFormView } from './components/view/formView';
import { SuccessView } from './components/view/successView';

// контейнеры
const cartContainer = ensureElement<HTMLButtonElement>('.header__basket');
const catalogContainer = ensureElement<HTMLElement>('.gallery');
const modalContainer = ensureElement<HTMLDivElement>('#modal-container');

// шаблоны
const productCatalogTemplate =
	ensureElement<HTMLTemplateElement>('#card-catalog');
const productModalTemplate =
	ensureElement<HTMLTemplateElement>('#card-preview');
const productBasketTemplate =
	ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const paymentFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderSuccessTemplate = ensureElement<HTMLTemplateElement>('#success');

// классы
const API = new WebLarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();

const catalog = new Catalog(events);
const basket = new Basket(events);
const form = new Form(events);

const cartView = new CartView(cartContainer, events);
const catalogView = new CatalogView(catalogContainer, events);
const basketView = new BasketView(basketTemplate, events);
const modalView = new ModalView(modalContainer, events);
const contactsFormView = new ContactsFormView(contactsFormTemplate, events);
const orderFormView = new OrderFormView(paymentFormTemplate, events);
const successView = new SuccessView(orderSuccessTemplate, events);

// для проверки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

/* основной код */

// получение данных в модель каталога
API.getProductList()
	.then((products) => {
		catalog.products = products;
	})
	.catch((error) => {
		console.log(error);
	});

// вывод каталога
events.on('catalog:get', (products: IProduct[]) => {
	const productsHTML = products.map((product: IProduct) => {
		const productView = new ProductCatalogView(productCatalogTemplate, events);
		return productView.render(product);
	});

	catalogView.products = productsHTML;
});

// передача id выбраной карточки в модель каталога
events.on('product:select', (data: TEvents) => {
	catalog.selectedProductId = data.id;
});

// вывод модалки с полным описанием товара
events.on('fullCard:change', (data: TEvents) => {
	const product = catalog.getProduct(data.id);
	const state = basket.isInBasket(data.id);
	const productFullView = new ProductFullView(productModalTemplate, events);
	productFullView.button = state;
	modalView.content = productFullView.render(product);
	modalView.open();
});

// добавление товара в корзину
events.on('basket:addProduct', (data: TEvents) => {
	const product = catalog.getProduct(data.id);
	basket.addProduct(product);
});

// удаление товара из корзины
events.on('basket:removeProduct', (data: TEvents) => {
	basket.removeProduct(data.id);
	cartView.counter = basket.getCount();
});

// закрытие пустой корзины
events.on('basket:removedAllProducts', () => {
	modalView.close();
});

// открытие модалки с корзиной
events.on('basket:change', () => {
	cartView.counter = basket.getCount();
	modalView.close();
});

// открытие корзины по клику на иконке
events.on('basket:open', () => {
	const productsHTML = basket.items.map((product, index) => {
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
	modalView.content = basketView.render();
	modalView.open();
});

// открытие пустой корзины
events.on('basket:isEmpty', () => {
	basketView.items = [];
	basketView.total = basket.getTotal();
	basketView.toggleButton(true);
	modalView.content = basketView.render();
	modalView.open();
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
events.on('payment:select', (data: TEvents) => {
	form.payment = data.payment;
});

events.on('payment:set', (data: TEvents) => {
	orderFormView.togglePayment(data.payment);
});

// вывод ошибок в форме
events.on('form:error', (data: TEvents) => {
	orderFormView.submit = true;
	orderFormView.error = data.error;
	contactsFormView.submit = true;
	contactsFormView.error = data.error;
});

events.on('form:valid', () => {
	orderFormView.submit = false;
	orderFormView.error = '';
	contactsFormView.submit = false;
	contactsFormView.error = '';
});

// изменения в полях формы
events.on('orderInput:change', (data: TEvents) => {
	form.updateOrderFields(data.field, data.value);
});

events.on('contactsInput:change', (data: TEvents) => {
	form.updateContactsFields(data.field, data.value);
});

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
		items: basket.getItemsIds(),
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
