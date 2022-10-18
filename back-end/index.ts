import express from 'express';
const PORT = process.env.PORT || 3001;
const app = express();

const MockShoppingLists = [
	{
		id: '1',
		name: 'Grocery',
	},
	{
		id: '2',
		name: 'Pharmacy',
	},
];

app.use(express.json());

app.get('/api/v1/shopping-lists', (req, res) => {
	res.status(200).json(MockShoppingLists);
});

app.get('/api/v1/shopping-lists/:id', (req, res) => {
	const { id } = req.params;
	const shoppingList = MockShoppingLists.filter((list) => {
		return list.id === id;
	});
	res.status(200).json(shoppingList);
});

app.post('/api/v1/shopping-lists', (req, res) => {
	const { name } = req.body;
	const nextId = MockShoppingLists.length + 1;
	const newList = { id: nextId.toString(), name };
	MockShoppingLists.push(newList);
	res.status(201).json(newList);
});

app.put('/api/v1/shopping-lists/:id', (req, res) => {
	const { name } = req.body;
	const { id } = req.params;
	const shoppingList = MockShoppingLists.find((list) => list.id === id);
	if (!shoppingList) {
		res.status(404).json('Shopping list does not exist.');
		return;
	}
	const indexOfList = MockShoppingLists.indexOf(shoppingList);
	const updatedList = { ...shoppingList, name };
	MockShoppingLists[indexOfList] = updatedList;
	res.status(200).json(updatedList);
});

app.delete('/api/v1/shopping-lists/:id', (req, res) => {
	const { id } = req.params;
	const shoppingList = MockShoppingLists.find((list) => list.id === id);
	if (!shoppingList) {
		res.status(404).json('Shopping list does not exist.');
		return;
	}
	const indexOfList = MockShoppingLists.indexOf(shoppingList);
	MockShoppingLists.splice(indexOfList, 1);
	res.status(200).json(shoppingList);
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}...`);
});
