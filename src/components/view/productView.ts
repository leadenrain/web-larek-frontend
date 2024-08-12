import { IProduct } from '../../types';
import { cloneTemplate } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Component } from '../base/componentView';
import { categories } from '../../utils/constants';

export class ProductView extends Component<IProduct> {
	protected _id: string;
	protected _description: HTMLParagraphElement;
	protected _image: HTMLImageElement;
	protected _title: HTMLHeadingElement;
	protected _category: HTMLSpanElement;
	protected _price: HTMLSpanElement;
	protected _button: HTMLButtonElement;

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		const element = cloneTemplate<HTMLElement>(template);
		super(element);

		this._title = this.container.querySelector('.card__title');
		this._price = this.container.querySelector('.card__price');
		this._button = this.container.querySelector('.card__button');
		this._description = this.container.querySelector('.card__text');
		this._category = this.container.querySelector('.card__category');
		this._image = this.container.querySelector('.card__image');
	}

	get id() {
		return this._id;
	}

	set id(id) {
		this._id = id;
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set image(value: string) {
		this.setImage(this._image, value);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set category(value: string) {
		this.setText(this._category, value);
		if (this._category) {
			this.toggleClass(this._category, categories[value], true);
		}

		// this._category?.classList.add(categories[value]);
	}

	set price(value: number) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');

		if (!value) {
			this.setDisabled(this._button, true);
		}
	}

	set button(state: boolean) {
		if (state) {
			this.setText(this._button, 'Удалить из корзины');
			this._button.addEventListener('click', () => {
				this.events.emit('basket:removeProduct', { id: this._id });
			});
		} else {
			this._button.addEventListener('click', () =>
				this.events.emit<Pick<IProduct, 'id'>>('basket:addProduct', {
					id: this._id,
				})
			);
		}
	}
}

export class ProductCatalogView extends ProductView {
	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		super(template, events);

		this.container.addEventListener('click', () =>
			this.events.emit<Pick<IProduct, 'id'>>('product:select', {
				id: this._id,
			})
		);
	}
}

export class ProductFullView extends ProductView {
	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		super(template, events);
	}
}

export class ProductBasketView extends ProductView {
	protected _index: HTMLSpanElement;

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		super(template, events);

		this._index = this.container.querySelector('.basket__item-index');
		this._button = this.container.querySelector('.basket__item-delete');

		this._button.addEventListener('click', () =>
			this.events.emit('basket:removeProduct', { id: this._id })
		);
	}

	set index(value: number) {
		this.setText(this._index, value);
	}
}
