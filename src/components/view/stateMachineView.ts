// Определение состояний
export enum StateView {
	HOME,
	DELIVERYPAYMENT,
	CONTACTS,
	FAVORITES,
	ACCOUNT,
	CART,
}

export class StateMachineView {
	private currentState: StateView;
	private transitions: Partial<Record<StateView, Record<string, StateView>>>;

	constructor(initialState: StateView) {
		this.currentState = initialState;
		this.transitions = {};
	}

	addTransition(fromState: StateView, toState: StateView, action: string) {
		if (!this.transitions[fromState]) {
			this.transitions[fromState] = {};
		}
		this.transitions[fromState][action] = toState;
	}

	transition(action: string) {
		if (
			this.transitions[this.currentState] &&
			this.transitions[this.currentState][action]
		) {
			this.currentState = this.transitions[this.currentState][action];
		} else {
			console.error(
				`Ошибка перехода из состояния ${this.currentState} с действием ${action}`
			);
		}
	}

	getCurrentState() {
		return this.currentState;
	}
}

/* Создание экземпляра ViewStateMachine. Cвойство currentState 
будет содержать начальное состояние HOME, свойство transitions 
будет пустым объектом */
const stateMachineView = new StateMachineView(StateView.HOME);

// Определение переходов между состояниями
stateMachineView.addTransition(
	StateView.HOME,
	StateView.DELIVERYPAYMENT,
	'SHOW_DELIVERYPAYMENT'
);
stateMachineView.addTransition(
	StateView.DELIVERYPAYMENT,
	StateView.HOME,
	'BACK_TO_HOME'
);
stateMachineView.addTransition(
	StateView.HOME,
	StateView.CONTACTS,
	'SHOW_CONTACTS'
);
stateMachineView.addTransition(
	StateView.CONTACTS,
	StateView.HOME,
	'BACK_TO_HOME'
);
stateMachineView.addTransition(
	StateView.HOME,
	StateView.FAVORITES,
	'SHOW_FAVORITES'
);
stateMachineView.addTransition(
	StateView.FAVORITES,
	StateView.HOME,
	'BACK_TO_HOME'
);
stateMachineView.addTransition(
	StateView.HOME,
	StateView.ACCOUNT,
	'SHOW_ACCOUNT'
);
stateMachineView.addTransition(
	StateView.ACCOUNT,
	StateView.HOME,
	'BACK_TO_HOME'
);
stateMachineView.addTransition(StateView.HOME, StateView.CART, 'SHOW_CART');
stateMachineView.addTransition(StateView.CART, StateView.HOME, 'BACK_TO_HOME');

// Пример использования
console.log(stateMachineView.getCurrentState()); // HOME

stateMachineView.transition('SHOW_CONTACTS');
console.log(stateMachineView.getCurrentState()); // CONTACTS

stateMachineView.transition('BACK_TO_HOME');
console.log(stateMachineView.getCurrentState()); // HOME

stateMachineView.transition('SHOW_FAVORITES');
console.log(stateMachineView.getCurrentState()); // FAVORITES
