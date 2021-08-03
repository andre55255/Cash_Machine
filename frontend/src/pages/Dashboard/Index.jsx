import React from 'react';
import './Index.css';
import { Divider } from 'antd';
import Status from './Status';
import Actions from './Actions';

export default function Index() {

    return (
        <div className="dashboard">
            <Status />
            <Divider>Ações</Divider>
            <Actions />
        </div>
    );
}
