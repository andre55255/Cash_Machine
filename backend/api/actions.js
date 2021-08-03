const db = require('../database/db');

function getMoney() {
    return function(req, res) {
        const { money } = req.body;
        const { numAccount } = req.account;
        if (numAccount && money) {
            db.select('*')
                .table('account')
                .where({ num_account: numAccount })
                .then(data => {
                    if (data.length < 1) return res.status(404).send({ error: 'Account is already exists' });
                    
                    if (parseFloat(data[0].balance) < parseFloat(money)) {
                        return res.status(400).send({ error: 'Balance insufficient, balance R$ '+data[0].balance });
                    } else {
                        db.update({
                            balance: data[0].balance - money
                        })
                        .table('account')
                        .where({ id: data[0].id })
                        .then(_ => res.status(200).send({
                            message: 'Value taken successfully',
                            valueAccount: parseFloat(data[0].balance) - parseFloat(money),
                            valueTaken: parseFloat(money)
                        }))
                        .catch(err => res.status(500).send({ error: 'Internal server error' }));
                    }
                })
                .catch(err => res.status(500).send({ error: 'Internal server error' }));
        } else {
            return res.status(400).send({ error: 'Data not reported' });
        }
    }
}

function setMoney() {
    return function(req, res) {
        const { money } = req.body;
        const { numAccount } = req.account;
        if (numAccount && money) {
            db.select('*')
                .table('account')
                .where({ num_account: numAccount })
                .then(data => {
                    if (data.length < 1) return res.status(404).send({ error: 'Account is already exists' });
                    
                    db.update({
                        balance: parseFloat(data[0].balance) + parseFloat(money)
                    })
                    .table('account')
                    .where({ id: data[0].id })
                    .then(_ => res.status(200).send({
                        message: 'Deposit successful',
                        valueDeposit: parseFloat(money),
                        newValue: parseFloat(data[0].balance) + parseFloat(money)
                    }))
                    .catch(err => res.status(500).send({ error: 'Internal server error' }));
                })
                .catch(err => res.status(500).send({ error: 'Internal server error' }));
        } else {
            return res.status(400).send({ error: 'Data not reported' });
        }
    }
}

function transferMoney() {
    return async function(req, res) {
        const accountSelf = req.account.numAccount;
        const { accountDest, money } = req.body;
        if (accountSelf && accountDest && money) {
            db.select('*')
                .table('account')
                .where({ num_account: accountSelf })
                .then(self => {
                    if (self.length < 1) return res.status(404).send({ error: 'Account is not exists' });

                    if (parseFloat(self[0].balance) < parseFloat(money)) {
                        return res.status(400).send({ error: 'Balance insufficient' });
                    } else {
                        db.transaction(async trans => {
                            try {
                                await trans.update({
                                    balance: parseFloat(self[0].balance) - parseFloat(money)
                                })
                                .table('account')
                                .where({ num_account: accountSelf });

                                const balanceDest = await trans.select('*')
                                                        .table('account')
                                                        .where({ num_account: accountDest });

                                await trans.update({
                                    balance: parseFloat(balanceDest[0].balance) + parseFloat(money)
                                })
                                .table('account')
                                .where({ num_account: accountDest });

                                return res.status(200).send({ message: 'Tranfer successfully' });
                            } catch (err) {
                                return res.status(400).send({ error: 'Transfer failed' });
                            }
                        })
                    }
                })
                .catch(err => res.status(500).send({ error: 'Internal server error' }));
        } else {
            return res.status(400).send({ error: 'Data not reported' });
        }
    }
}

module.exports = {
    getMoney,
    setMoney,
    transferMoney
}