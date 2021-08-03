import React, { useState, useContext } from 'react';
import './Auth.css';
import { Card, Form, Input, Button, message } from 'antd';
import { CreditCardOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { AccountContext } from '../provider/account';

export default function Auth() {

    const [numAccount, setNumAccount] = useState('');
    const [password, setPassword] = useState('');
    const { setAccount } = useContext(AccountContext);
    const history = useHistory();

    function nextPage() {
        if (!(numAccount && password)) {
            return message.warning("Informe os dados");
        } else {
            axios({
                url: `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT_API}/account/logInto`,
                method: "post",
                data: { numAccount, password }
            }).then(resp => {
                if (resp.data.error) {
                    console.log(resp.data.error);
                    return message.error("Falha na autenticação");
                } else {
                    message.success("Autenticado com sucesso");
                    setAccount({
                        balance: resp.data.balance,
                        client: resp.data.client,
                        numAccount: resp.data.numAccount,
                        status: resp.data.status,
                        token: resp.data.token,
                        typeAccount: resp.data.typeAccount
                    });
                    history.push('/dash');
                }
            }).catch(err => {
                console.log(err);
                return message.error("Falha na autenticação");
            })
        }
    }

    return (
        <div className="auth">
            <Card 
                title="Insira os dados"
                style={{
                    width: 500,
                    textAlign: 'center'
                }}
            >
                <Form
                    name="auth"
                >
                    <Form.Item>
                        <Input 
                            name="numAccount"
                            type="number"
                            placeholder="Número da conta"
                            prefix={<CreditCardOutlined />}
                            onChange={e => setNumAccount(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Input.Password 
                            name="password"
                            type="password"
                            placeholder="Senha"
                            prefix={<LockOutlined />}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </Form.Item>
                    <div className="auth-group-btn">
                        <Button
                            type="primary"
                            onClick={nextPage}
                        >
                            Avançar
                        </Button>
                        <Button
                            type="default"
                            style={{
                                marginLeft: '.5rem'
                            }}
                        >
                            <Link to="/create">
                                Registrar
                            </Link>
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
}
