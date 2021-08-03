import React, { useContext } from 'react';
import './Status.css';
import { AccountContext } from '../../provider/account';
import { Card } from 'antd';

export default function Status() {

    const { account } = useContext(AccountContext);

    return (
        <Card
            title={`Status da conta ${account.status ? "Aberta" : "Fechada"}`}
            className="card-status"
        >
            <div className="items">
                <span>
                    <strong>Cliente: </strong>
                    {account.client}
                </span>
                <span>
                    <strong>Número da conta: </strong>
                    {account.numAccount}
                </span>
                <span>
                    <strong>Tipo de conta: </strong>
                    {account.typeAccount}
                </span>
                <span>
                    <strong>Saldo: </strong>
                    {parseFloat(account.balance).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
                </span>
            </div>
        </Card>
    )
}
