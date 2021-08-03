import React, { useState } from "react";
import "./Create.css";
import { Link } from "react-router-dom";
import { CreditCardOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Form, Input, Button, Radio, message } from "antd";
import axios from 'axios';

export default function Create() {

  const [client, setClient] = useState('');
  const [numAccount, setNumAccount] = useState('');
  const [password, setPassword] = useState('');
  const [typeAccount, setTypeAccount] = useState(1);

  function createAccount() {

    if (!(client && numAccount && password && typeAccount)) {
      return message.warning("Informe os dados");
    } else if (client.length < 8) {
      return message.warning("Informe seu nome completo");
    } else if (numAccount.length !== 11) {
      return message.warning("O número da conta deve conter 11 dígitos/caracteres");
    } else if (password.length !== 4) {
      return message.warning("A senha deve conter 4 dígitos/caracteres");
    } else if (typeAccount < 1 || typeAccount > 2) {
      return message.warning("Tipo de conta inválido");
    } else {
      axios({
        url: `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT_API}/account/create`,
        method: "post",
        data: { client, numAccount, password, typeAccount }
      }).then(resp => {
        if (resp.data.error) {
          return message.error("Error ao abrir a conta, tente novamente mais tarde");
        } else {
          return message.success("Conta aberta com sucesso");
        }
      }).catch(err => {
        console.log(err);
        return message.error("Erro ao abrir a conta, tente novamente mais tarde");
      })
    }
  }

  return (
    <div className="create">
      <Card
        title="Crie sua conta"
        style={{
          width: 500,
          textAlign: "center",
        }}
      >
        <Form name="auth">
          <Form.Item>
            <Input
              name="client"
              type="text"
              placeholder="Nome completo"
              prefix={<UserOutlined />}
              onChange={(e) => setClient(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Input
              name="numAccount"
              type="number"
              placeholder="Número da conta"
              prefix={<CreditCardOutlined />}
              onChange={(e) => setNumAccount(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Radio.Group onChange={e => setTypeAccount(e.target.value)} value={typeAccount}>
              <Radio value={1}>Conta corrente</Radio>
              <Radio value={2}>Conta poupança</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Input.Password
              name="password"
              type="password"
              placeholder="Senha"
              prefix={<LockOutlined />}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
          <div className="auth-group-btn">
            <Button 
              type="primary"
              onClick={createAccount}
            >
              Criar
            </Button>
            <Button
              type="default"
              style={{
                marginLeft: ".5rem",
              }}
            >
              <Link to="/">Voltar</Link>
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
