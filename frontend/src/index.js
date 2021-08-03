import React from 'react';
import ReactDOM from 'react-dom';
import App from './container/App';

import 'antd/dist/antd.css';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/lib/locale/pt_BR';

import 'dotenv/config';

ReactDOM.render(
    <ConfigProvider locale={ptBR}>
        <App />
    </ConfigProvider>,
    document.getElementById('root')
);