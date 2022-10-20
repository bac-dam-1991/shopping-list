import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ShoppingListView } from './views/ShoppingListView';
import { HomeView } from './views/HomeView';
import { NotFoundView } from './views/NotFoundView';
import { AllShoppingListsView } from './views/AllShoppingListsView';

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomeView />} />
				<Route path="/shopping-lists">
					<Route index element={<AllShoppingListsView />} />
					<Route path=":id" element={<ShoppingListView />} />
				</Route>
				<Route path="*" element={<NotFoundView />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
