import { cloneTemplate } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Component } from '../base/componentView';

type TFormView = {
	error: string;
};

export class FormView extends Component<TFormView> {
	protected _button: HTMLButtonElement;
	protected _error: HTMLSpanElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._button = this.container.querySelector('.button[type="submit"]');
		this._error = this.container.querySelector('.form__errors');

		this.container.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.events.emit(`form: next`);
		});
		this.setDisabled(this._button, true);
	}

	set submit(state: boolean) {
		this.setDisabled(this._button, state);
	}

	set error(value: string) {
		this.setText(this._error, value);
	}
}

export class OrderFormView extends FormView {
	protected _payCard: HTMLButtonElement;
	protected _payCash: HTMLButtonElement;
	protected _addressField: HTMLInputElement;

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		const element = cloneTemplate<HTMLElement>(template);
		super(element, events);

		this._payCard = this.container.querySelector('.button[name="card"]');
		this._payCash = this.container.querySelector('.button[name="cash"]');
		this._addressField = this.container.querySelector('input[name="address"]');

		this.toggleClass(this._payCard, 'button_alt-active', true);

		this.container.addEventListener('input', (evt) => {
			const target = evt.target as HTMLInputElement;
			const field = target.name;
			const value = target.value;
			this.events.emit(`order input: change`, { field, value });
		});

		this._payCard.addEventListener('click', () => {
			this.togglePayment('card');
			this.events.emit('payment: select', { payment: 'card' });
		});

		this._payCash.addEventListener('click', () => {
			this.togglePayment('cash');
			this.events.emit('payment: select', { payment: 'cash' });
		});
	}

	togglePayment(value: string) {
		if (value === 'card') {
			this.toggleClass(this._payCard, 'button_alt-active', true);
			this.toggleClass(this._payCash, 'button_alt-active', false);
		} else {
			this.toggleClass(this._payCard, 'button_alt-active', false);
			this.toggleClass(this._payCash, 'button_alt-active', true);
		}
	}

	set address(value: string) {
		this._addressField.value = value;
	}

	clear() {
		this._addressField.value = '';
		this._error.textContent = '';
	}
}

export class ContactsFormView extends FormView {
	protected _emailField: HTMLInputElement;
	protected _phoneField: HTMLInputElement;

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		const element = cloneTemplate<HTMLElement>(template);
		super(element, events);

		this._emailField = this.container.querySelector('input[name="email"]');
		this._phoneField = this.container.querySelector('input[name="phone"]');

		this.container.addEventListener('input', (evt) => {
			const target = evt.target as HTMLInputElement;
			const field = target.name;
			const value = target.value;
			this.events.emit(`contacts input: change`, { field, value });
		});

		this.container.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.events.emit(`order: ready`);
		});
	}

	set email(value: string) {
		this._emailField.value = value;
	}

	set phone(value: string) {
		this._phoneField.value = value;
	}

	clear() {
		this._emailField.value = '';
		this._phoneField.value = '';
		this._error.textContent = '';
	}
}
