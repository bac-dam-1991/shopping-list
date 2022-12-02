import { Container, Typography, Paper, Stack } from '@mui/material';
import { ProfileDetails } from '../components/ProfileDetails';
import { AuthButton } from '../components/AuthButton';

export const HomeView = () => {
	return (
		<Container maxWidth="sm">
			<Typography
				variant="h3"
				component="h1"
				sx={{ my: 5, textAlign: 'center' }}
			>
				Shopping List App
			</Typography>
			<Paper sx={{ p: 5, maxWidth: 400, m: 'auto' }}>
				<Stack spacing={2}>
					<ProfileDetails />
					<AuthButton />
				</Stack>
			</Paper>
		</Container>
	);
};
