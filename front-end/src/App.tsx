import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ShoppingListView } from './views/ShoppingListView';
import { HomeView } from './views/HomeView';
import { NotFoundView } from './views/NotFoundView';
import { AllShoppingListsView } from './views/AllShoppingListsView';
import { Auth0ProviderWithHistory } from './components/AuthProviderWithHistory';
import { Navbar } from './components/Navbar';

const App = () => {
	return (
		<BrowserRouter>
			<Auth0ProviderWithHistory>
				<Navbar />
				<Routes>
					<Route path="/" element={<HomeView />} />
					<Route path="/shopping-lists">
						<Route index element={<AllShoppingListsView />} />
						<Route path=":id" element={<ShoppingListView />} />
					</Route>
					<Route path="*" element={<NotFoundView />} />
				</Routes>
			</Auth0ProviderWithHistory>
		</BrowserRouter>
	);
};

export default App;
