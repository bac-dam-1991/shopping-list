import { useAuth0 } from '@auth0/auth0-react';
import { Stack, Typography } from '@mui/material';
import { Loader } from './Loader';

export const ProfileDetails = () => {
	const { isLoading, isAuthenticated, user } = useAuth0();

	if (isLoading) {
		return <Loader />;
	}

	if (!isAuthenticated) {
		return null;
	}

	return (
		<Stack spacing={2}>
			<Typography>Name: {user?.name}</Typography>
			<Typography>Email: {user?.email}</Typography>
		</Stack>
	);
};
