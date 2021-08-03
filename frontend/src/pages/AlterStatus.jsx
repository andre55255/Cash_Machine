import React, { useContext } from 'react';
import './AlterStatus.css';
import { AccountContext } from '../provider/account';
import { Button, message } from 'antd';
import axios from 'axios';

export default function AlterStatus() {

    const { account, setAccount } = useContext(AccountContext);
    
    function closeAccount() {
        if (parseFloat(account.balance) !== 0) {
            return message.warning("A conta possui saldo, não sendo possível fechar");
        } else {
            axios({
                url: `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT_API}/account/close`,
                method: "post",
                headers: {
                    Authorization: "Bearer "+account.token
                }
            }).then(resp => {
                if (resp.data.error) {
                    return message.error("Erro ao fechar a conta");
                } else {
                    setAccount({
                        numAccount: account.numAccount,
                        typeAccount: account.typeAccount,
                        client: account.client,
                        balance: account.balance,
                        status: !account.status,
                        token: account.token
                    });
                    return message.success("Conta fechada com sucesso");
                }
            }).catch(err => {
                console.log(err);
                return message.error("Erro ao fechar a conta");
            })
        }
    }

    function openAccount() {
        axios({
            url: "http://10.0.0.107:8080/account/open",
            method: "post",
            headers: {
                Authorization: "Bearer "+account.token
            }
        }).then(resp => {
            if (resp.data.error) {
                return message.error("Erro ao reabrir a conta");
            } else {
                setAccount({
                    numAccount: account.numAccount,
                    typeAccount: account.typeAccount,
                    client: account.client,
                    balance: account.balance,
                    status: !account.status,
                    token: account.token
                });
                return message.success("Conta foi reaberta");
            }
        }).catch(err => {
            console.log(err);
            return message.error("Erro ao reabrir a conta");
        });
    }

    function RenderButton() {
        if (account.status) {
            return (
                <Button
                    type="dashed"
                    danger
                    className="alter-btn"
                    onClick={closeAccount}
                >
                    Fechar conta
                </Button>
            );
        } else {
            return (
                <Button
                    type="primary"
                    className="alter-btn"
                    onClick={openAccount}
                >
                    Reabrir conta
                </Button>
            );
        }
    }

    return (
        <div className="alter">
            <RenderButton />
        </div>
    )
}
