import React from 'react';
import './Actions.css';
import { Card, Button } from 'antd';
import { Link } from 'react-router-dom';

export default function Actions() {
    return (
        <Card
            className="card-actions"
        >
            <div className="card-actions-options">
                <div className="card-actions-items">
                    <Button
                        type="primary"
                        block
                    >
                        <Link to="/setMoney">
                            Despósito
                        </Link>
                    </Button>
                    <Button
                        type="primary"
                        block
                    >
                        <Link to="/getMoney">
                            Saque
                        </Link>
                    </Button>
                </div>
                <div className="card-actions-items">
                    <Button
                        type="primary"
                        block
                    >
                        <Link to="/transfers">
                            Transferências
                        </Link>
                    </Button>
                    <Button
                        type="primary"
                        block
                    >
                        <Link to="/alterStatus">
                            Abrir/Fechar conta
                        </Link>
                    </Button>
                </div>
            </div>
        </Card>
    );
}
