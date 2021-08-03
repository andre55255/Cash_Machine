import React from 'react';
import Routes from '../routes/Routes';
import { AccountProvider } from '../provider/account';

export default function App() {
    return (
        <AccountProvider>
            <Routes />
        </AccountProvider>
    );
}
