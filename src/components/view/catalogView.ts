import { Component } from '../base/componentView';
import { IEvents } from '../base/events';

type TCatalogView = {
	products: HTMLElement[];
};

export class CatalogView extends Component<TCatalogView> {
	protected _products: HTMLElement[];

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
	}

	set products(products: HTMLElement[]) {
		this.container.replaceChildren(...products);
	}
}
