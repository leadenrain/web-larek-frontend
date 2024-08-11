import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/componentView';
import { IEvents } from '../base/events';

type TBasketView = {
	items: HTMLLIElement[];
	total: number;
};

export class BasketView extends Component<TBasketView> {
	protected _items: HTMLUListElement;
	protected _total: HTMLSpanElement;
	protected _button: HTMLButtonElement;

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		const element = cloneTemplate<HTMLElement>(template);
		super(element);

		this._items = this.container.querySelector('.basket__list');
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		this._button.addEventListener('click', () => {
			this.events.emit('order: start');
		});
	}

	set items(items: HTMLLIElement[]) {
		this._items.replaceChildren(...items);
	}

	set total(value: number) {
		this.setText(this._total, `${value} синапсов`);
	}

	toggleButton(state: boolean) {
		this.setDisabled(this._button, state);
	}
}

type TCartView = {
	counter: number;
};

export class CartView extends Component<TCartView> {
	protected _counter: HTMLSpanElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._counter = ensureElement<HTMLSpanElement>('.header__basket-counter');

		this.container.addEventListener('click', () => {
			if (this._counter.textContent === '0') {
				this.events.emit('basket: is empty');
			}
			this.events.emit('basket: open');
		});
	}

	set counter(value: number) {
		this.setText(this._counter, String(value));
	}
}
