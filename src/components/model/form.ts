import { IForm, TPaymentMethod, TFields } from '../../types';
import { IEvents } from '../base/events';

const ERROR_MESSAGES: Record<string, string> = {
	address: 'Введите адрес',
	email: 'Введите email',
	phone: 'Введите номер телефона',
};

export class Form implements IForm {
	protected _payment = 'card';
	protected _address = '';
	protected _email = '';
	protected _phone = '';

	constructor(protected events: IEvents) {}

	set payment(method: TPaymentMethod) {
		this._payment = method;
	}

	set address(value: string) {
		this._address = value;
	}

	set email(value: string) {
		this._email = value;
	}

	set phone(value: string) {
		this._phone = value;
	}

	get buyerData() {
		return {
			payment: this._payment,
			address: this._address,
			email: this._email,
			phone: this._phone,
		};
	}

	updateOrderFields(field: keyof TFields, value: string) {
		this[field] = value;

		const valid = this.checkValidityOrder();

		if (typeof valid === 'string') {
			this.events.emit('form: error', {
				error: valid,
			});
		} else {
			this.events.emit('form: valid');
		}
	}

	updateContactsFields(field: keyof TFields, value: string) {
		this[field] = value;

		const valid = this.checkValidityContacts();

		if (typeof valid === 'string') {
			this.events.emit('form: error', {
				error: valid,
			});
		} else {
			this.events.emit('form: valid');
		}
	}

	checkValidityOrder(): true | string {
		if (this._address.trim().length === 0) {
			return ERROR_MESSAGES.address;
		}

		return true;
	}

	checkValidityContacts(): true | string {
		if (this._email.trim().length === 0) {
			return ERROR_MESSAGES.email;
		}

		if (this._phone.trim().length === 0) {
			return ERROR_MESSAGES.phone;
		}

		return true;
	}

	clear() {
		this._payment = 'card';
		this._address = '';
		this._email = '';
		this._phone = '';
	}
}
