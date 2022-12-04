export type WithId<T> = T & { id: string };

export interface ShoppingItem {
	name: string;
	unit: string;
	quantity: number;
	status: string;
}

export interface ShoppingList {
	name: string;
	items: WithId<ShoppingItem>[];
	sub: string;
}
