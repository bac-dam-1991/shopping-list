import { Stack, CircularProgress, Typography } from '@mui/material';

export const Loader = () => {
	return (
		<Stack
			sx={{ minHeight: 200, justifyContent: 'center', alignItems: 'center' }}
			spacing={2}
		>
			<CircularProgress />
			<Typography variant="caption">Loading</Typography>
		</Stack>
	);
};
