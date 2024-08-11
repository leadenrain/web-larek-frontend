export type ApiListResponse<T> = {
	total: number;
	items: T[];
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
	readonly baseUrl: string;
	protected options: RequestInit;

	constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...((options.headers as object) ?? {}),
			},
		};
	}

	protected handleResponse<T>(res: Response): Promise<T> {
		if (res.ok) return res.json();
		else
			return res
				.json()
				.then((data) => Promise.reject(data.error ?? res.statusText));
	}

	get<T>(uri: string) {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method: 'GET',
		}).then(this.handleResponse<T>);
	}

	post<T>(uri: string, data: object, method: ApiPostMethods = 'POST') {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method,
			body: JSON.stringify(data),
		}).then(this.handleResponse<T>);
	}
}
