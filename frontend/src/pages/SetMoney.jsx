import React, { useState, useContext } from 'react';
import './SetMoney.css';
import { AccountContext } from '../provider/account';
import { Card, Input, Form, Button, message } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import axios from 'axios';

export default function GetMoney() {

    const { account, setAccount } = useContext(AccountContext);
    const [money, setMoney] = useState(0);

    function makeDeposit() {
        if (!money) {
            return message.warning("Informe o valor a ser depositado");
        } else if (parseFloat(money) <= 0) {
            return message.warning("Não é possível fazer um depósito negativo");
        }else {
            axios({
                url: `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT_API}/action/setMoney`,
                method: "post",
                headers: {
                    Authorization: "Bearer "+account.token,
                },
                data: {
                    money
                }
            }).then(resp => {
                if (resp.data.error) {
                    return message.error("Falha ao realizar depósito, tente novamente mais tarde");
                } else {
                    setAccount({
                        numAccount: account.numAccount,
                        typeAccount: account.typeAccount,
                        client: account.client,
                        balance: resp.data.newValue,
                        status: account.status,
                        token: account.token
                    });
                    return message.success(`Depositado ${parseFloat(resp.data.valueDeposit).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})} - Novo saldo ${parseFloat(resp.data.newValue).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`);
                }
            }).catch(err => {
                console.log(err);
                return message.error("Falha ao realizar depósito, tente novamente mais tarde");
            })
        }
    }

    return (
        <div className="set-money">
            <Card
                title="Depósito"
                className="set-money-card"
            >
                <Form
                    name="setMoney"
                >
                    <Form.Item>
                        <Input 
                            type="number"
                            name="money"
                            placeholder="Valor a ser depositado"
                            prefix={<DollarOutlined />}
                            onChange={e => setMoney(e.target.value)}
                        />
                        <Button
                            type="primary"
                            style={{
                                marginTop: ".5rem"
                            }}
                            onClick={makeDeposit}
                        >
                            Depositar
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}