import { IForm, TPaymentMethod, TOrder } from '../../types';
import { ERROR_MESSAGES } from '../../utils/constants';
import { IEvents } from '../base/events';

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

	updateOrderFields(field: keyof TOrder, value: string) {
		this[field] = value;

		const valid = this.checkValidityOrder();

		if (typeof valid === 'string') {
			this.events.emit('form:error', {
				error: valid,
			});
		} else {
			this.events.emit('form:valid');
		}
	}

	updateContactsFields(field: keyof TOrder, value: string) {
		this[field] = value;

		const valid = this.checkValidityContacts();

		if (typeof valid === 'string') {
			this.events.emit('form:error', {
				error: valid,
			});
		} else {
			this.events.emit('form:valid');
		}
	}

	checkValidityOrder(): true | string {
		if (this._address.trim().length === 0) {
			return ERROR_MESSAGES.address;
		}

		return true;
	}

	checkValidityContacts(): true | string {
		if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(this._email)) {
			return ERROR_MESSAGES.email;
		}

		if (!/^\+?[0-9]{10,14}$/.test(this._phone)) {
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
