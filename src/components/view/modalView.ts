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

	private toggleModal(state = true) {
		this.toggleClass(this.container, 'modal_active', state);
	}

	private handleEscape = (evt: KeyboardEvent) => {
		if (evt.key === 'Escape') {
			this.close();
		}
	};

	open() {
		this.toggleModal();
		document.body.style.overflow = 'hidden';
		document.addEventListener('keydown', this.handleEscape);
		this.events.emit('modal:open');
	}

	close() {
		this.toggleModal(false);
		this.content = null;
		document.body.style.overflow = '';
		document.removeEventListener('keydown', this.handleEscape);
		this.events.emit('modal:close');
	}
}
