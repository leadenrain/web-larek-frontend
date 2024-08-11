import { Component } from '../base/componentView';
import { IEvents } from '../base/events';

type TModalView = {
	content: HTMLElement;
};

export class ModalView extends Component<TModalView> {
	protected closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLDivElement, protected events: IEvents) {
		super(container);

		this.closeButton = container.querySelector('.modal__close');
		this._content = container.querySelector('.modal__content');

		this.closeButton.addEventListener('click', () => {
			this.close();
		});
		this.container.addEventListener('click', (evt) => {
			if (evt.target === evt.currentTarget) {
				this.close();
			}
		});
	}

	set content(content: HTMLElement) {
		this._content.replaceChildren(content);
	}

	open() {
		this.toggleClass(this.container, 'modal_active', true);
		document.body.style.overflow = 'hidden';
		this.events.emit('modal: open');
	}

	close() {
		this.toggleClass(this.container, 'modal_active', false);
		this.content = null;
		document.body.style.overflow = '';
		this.events.emit('modal: close');
	}
}
