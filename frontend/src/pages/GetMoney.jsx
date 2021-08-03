import React, { useState, useContext } from "react";
import "./GetMoney.css";
import { AccountContext } from "../provider/account";
import { Card, Input, Form, Button, message } from "antd";
import { DollarOutlined } from "@ant-design/icons";
import axios from "axios";

export default function GetMoney() {

  const [money, setMoney] = useState(0);
  const { account, setAccount } = useContext(AccountContext);

  function toWithdraw() {
    
    if (!money) {
      return message.warning("informe os dados");
    } else if(parseFloat(money) > parseFloat(account.balance)) {
      return message.warning(`Saldo insuficiente. Seu saldo ${parseFloat(account.balance).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`);
    } else if(parseFloat(money) <= 0) {
      return message.warning('Não é possível sacar valores negativos');
    } else {
      axios({
        url: `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT_API}/action/getMoney`,
        method: "post",
        headers: {
          Authorization: "Bearer "+account.token
        },
        data: { money, numAccount: account.numAccount }
      }).then(resp => {
        if (resp.data.error) {
          return message.error("Saque falhou");
        } else {
          setAccount({
            numAccount: account.numAccount,
            typeAccount: account.typeAccount,
            client: account.client,
            balance: resp.data.valueAccount,
            status: account.status,
            token: account.token
          });
          return message.success(`Sacado com sucesso ${parseFloat(resp.data.valueTaken).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}. Novo saldo ${parseFloat(resp.data.valueAccount).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}`);
        }
      }).catch(err => {
        console.log(err);
        return message.error("Saque falhou");
      })
    }
  }

  return (
    <div className="get-money">
      <Card title="Saque" className="get-money-card">
        <Form name="getMoney">
          <Form.Item>
            <Input
              type="number"
              name="money"
              placeholder="Valor a ser sacado"
              prefix={<DollarOutlined />}
              onChange={(e) => setMoney(e.target.value)}
            />
            <Button
              type="primary"
              style={{
                marginTop: ".5rem",
              }}
              onClick={toWithdraw}
            >
              Sacar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
