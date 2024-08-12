import { cloneTemplate } from '../../utils/utils';
import { Component } from '../base/componentView';
import { IEvents } from '../base/events';

type TSuccessView = {
	message: string;
};

export class SuccessView extends Component<TSuccessView> {
	protected _message: HTMLParagraphElement;
	protected button: HTMLButtonElement;

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		const element = cloneTemplate<HTMLElement>(template);
		super(element);

		this._message = this.container.querySelector('.order-success__description');
		this.button = this.container.querySelector('.order-success__close');

		this.button.addEventListener('click', () => {
			this.events.emit('order:success');
		});
	}

	set message(total: number) {
		this.setText(this._message, `Списано ${total} синапсов`);
	}
}
