import { AppBar, Toolbar, Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthButton } from './AuthButton';

export const Navbar = () => {
	const navigate = useNavigate();

	return (
		<AppBar position="static">
			<Toolbar>
				<Stack sx={{ flexGrow: 1, alignItems: 'start' }}>
					<Button onClick={() => navigate('/')} color="inherit">
						Home
					</Button>
				</Stack>
				<Stack spacing={2} direction="row">
					<Button color="inherit" onClick={() => navigate('/shopping-lists')}>
						Shopping Lists
					</Button>
					<AuthButton />
				</Stack>
			</Toolbar>
		</AppBar>
	);
};
