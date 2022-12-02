import { useNavigate } from 'react-router-dom';
import { Auth0Provider, AppState } from '@auth0/auth0-react';
import { ReactNode } from 'react';

export interface Auth0ProviderWithHistoryProps {
	children: ReactNode;
}

export const Auth0ProviderWithHistory = ({
	children,
}: Auth0ProviderWithHistoryProps) => {
	const domain = 'shopping-list.au.auth0.com';
	const clientId = '6b8VEO6sia65RcUtW6GQsptuxyfPv0y4';

	const navigate = useNavigate();

	const onRedirectCallback = (appState?: AppState) => {
		navigate(appState?.returnTo || window.location.pathname);
	};

	return (
		<Auth0Provider
			domain={domain}
			clientId={clientId}
			redirectUri={window.location.origin}
			onRedirectCallback={onRedirectCallback}
		>
			{children}
		</Auth0Provider>
	);
};
