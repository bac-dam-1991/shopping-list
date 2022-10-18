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

app.get('/api/v1/shopping-lists', (req, res) => {
	res.status(200).json(MockShoppingLists);
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}...`);
});
