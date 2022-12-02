import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@mui/material';

export const LogoutButton = () => {
	const { logout } = useAuth0();
	return (
		<Button variant="outlined" color="inherit" onClick={() => logout()}>
			Log Out
		</Button>
	);
};
