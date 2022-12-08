import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useCallback } from 'react';

export const useHttpClient = () => {
	const { getAccessTokenSilently } = useAuth0();

	const getClient = useCallback(async () => {
		const token = await getAccessTokenSilently();
		return axios.create({
			baseURL: process.env.REACT_APP_SERVER,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	}, [getAccessTokenSilently]);

	return { getClient };
};
