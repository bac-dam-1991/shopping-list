import {
	Box,
	Dialog,
	DialogActions,
	DialogContent,
	DialogProps,
	DialogTitle,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import { ReactNode } from 'react';

export interface ModalProps extends DialogProps {
	title?: string;
	action?: ReactNode;
}

export const Modal = ({ title, children, action, ...rest }: ModalProps) => {
	const theme = useTheme();
	const upSm = useMediaQuery(theme.breakpoints.up('sm'));

	return (
		<Dialog maxWidth="sm" fullWidth {...rest} fullScreen={!upSm}>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>
				<Box sx={{ py: 3 }}>{children}</Box>
			</DialogContent>
			<DialogActions>{action}</DialogActions>
		</Dialog>
	);
};
