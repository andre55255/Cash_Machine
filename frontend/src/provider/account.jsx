import React, { useState } from 'react';

export const AccountContext = React.createContext({  });

export const AccountProvider = props => {
    const [account, setAccount] = useState({
        token: '',
        numAccount: '',
        typeAccount: '',
        client: '',
        balance: '',
        status: ''
    });

    return (
        <AccountContext.Provider value={{ account, setAccount }}>
            {props.children}
        </AccountContext.Provider>
    );
}