export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
	headers: {
		authorization: `${process.env.API_TOKEN}`,
		'Content-Type': 'application/json',
	},
};

export const categories: Record<string, string> = {
	'софт-скил': 'card__category_soft',
	'хард-скил': 'card__category_hard',
	другое: 'card__category_other',
	дополнительное: 'card__category_additional',
	кнопка: 'card__category_button',
};
