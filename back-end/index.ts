import express from 'express';
import cors from 'cors';
import shoppingListsController from './src/controllers/shopping-lists';
import { errorHandler } from './src/middlewares/error-handler';

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1/shopping-lists', shoppingListsController);
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}...`);
});
