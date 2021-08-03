import React, { useState, useContext } from "react";
import "./Transfers.css";
import { AccountContext } from "../provider/account";
import { Card, Input, Form, Button, message } from "antd";
import { DollarOutlined, CreditCardOutlined } from "@ant-design/icons";
import axios from "axios";

export default function Transfers() {
  const { account, setAccount } = useContext(AccountContext);
  const [money, setMoney] = useState(0);
  const [accountDest, setAccountDest] = useState(0);

  function transfer() {
    if (!(money && accountDest)) {
      return message.warning("Informe os dados");
    } else if (parseFloat(money) <= 0) {
      return message.warning("O valor de transferência deve ser maior que 0");
    } else if (parseFloat(money) > parseFloat(account.balance)) {
      return message.warning("Saldo insuficiente para transferência. Seu saldo é "+parseFloat(account.balance).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}));
    } else if (parseFloat(account.numAccount) === parseFloat(accountDest)) {
      return message.warning("Você não pode transferir para sua conta");
    }else {
      axios({
        url: `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT_API}/action/transferMoney`,
        method: "post",
        headers: {
          Authorization: "Bearer " + account.token,
        },
        data: {
          money,
          accountDest,
        },
      })
        .then((resp) => {
          if (resp.data.error) {
            return message.error("Tranferência falhou, a conta de destino pode estar errada");
          } else {
            setAccount({
              numAccount: account.numAccount,
              typeAccount: account.typeAccount,
              client: account.client,
              balance: parseFloat(account.balance) - parseFloat(money),
              status: account.status,
              token: account.token
            });
            return message.success("Tranferência efetuada com sucesso");
          }
        })
        .catch((err) => {
          console.log(err);
          return message.error("Tranferência falhou, a conta de destino pode estar errada");
        });
    }
  }

  return (
    <div className="transfers">
      <Card title="Tranferência" className="transfers-card">
        <Form name="transfers">
          <Form.Item>
            <Input
              type="number"
              name="accDest"
              placeholder="Digite o número da conta de destino"
              prefix={<CreditCardOutlined />}
              onChange={(e) => setAccountDest(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Input
              type="number"
              name="money"
              placeholder="Valor a ser depositado"
              prefix={<DollarOutlined />}
              onChange={(e) => setMoney(e.target.value)}
            />
          </Form.Item>
          <Button
            type="primary"
            style={{
              marginTop: ".5rem",
            }}
            onClick={transfer}
          >
            Tranferir
          </Button>
        </Form>
      </Card>
    </div>
  );
}
