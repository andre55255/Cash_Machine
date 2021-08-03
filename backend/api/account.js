const db = require('../database/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function createAccount() {
    return function(req, res) {
        const { numAccount, typeAccount, client, password } = req.body;
        let balance, type_account;
        if (numAccount && typeAccount && client && password) {
            db.select('*')
                .table('account')
                .where({ num_account: numAccount })
                .then(data => {
                    if (data.length > 0) return res.status(409).send({ error: 'Account is already exists' });

                    if (typeAccount == 1) {
                        type_account = "Conta corrente";
                        balance = 50;
                    } else if(typeAccount == 2){
                        type_account = "Conta poupança";
                        balance = 150;
                    } else {
                        return res.status(400).send({ error: 'Type account is invalid' });
                    }

                    bcrypt.hash(password, 10, (err, hash) => {
                        if (err) return res.status(500).send({ error: 'Internal server error' });

                        if (hash) {
                            db.insert({
                                num_account: numAccount,
                                type_account,
                                password: hash,
                                client,
                                balance,
                                status: true
                            })
                            .into('account')
                            .then(_ => res.status(201).send({ message: 'Account create successfully' }))
                            .catch(err => res.status(500).send({ error: 'Internal server error' }));
                        } else {
                            return res.status(500).send({ error: 'Internal server error' });
                        }
                    });
                })
                .catch(err => res.status(500).send({ error: 'Internal server error' }));
        } else {
            return res.status(400).send({ error: 'Data not reported' });
        }
    }
}

function closeAccount() {
    return function(req, res) {
        const { numAccount } = req.account;
        
        if (numAccount) {
            db.select('*')
            .table('account')
            .where({ num_account: numAccount })
            .then(data => {
                if (data.length < 1) return res.status(404).send({ error: 'Account is not exists' });
                
                if (!data[0].status) {
                    return res.status(409).send({ error: 'Account is status closed' });
                } else if (data[0].balance < 0) {
                    return res.status(400).send({ error: 'Account is balance negative' });
                } else if (data[0].balance > 0) {
                    return res.status(400).send({ error: 'Account has balance' });
                } else {
                    db.update({
                        status: false
                    })
                    .table('account')
                    .then(_ => res.status(200).send({ message: 'Closed account' }))
                    .catch(err => res.status(500).send({ error: 'Internal server error' }));
                }
            })
            .catch(err => res.status(500).send({ error: 'Internal server error' }));
        } else {
            return res.status(400).send({ error: 'Data not reported' });
        }
    }
}

function openAccount() {
    return function (req, res) {
        const { numAccount } = req.account;
        
        if (numAccount) {
            db.select('*')
            .table('account')
            .where({ num_account: numAccount })
            .then(data => {
                if (data.length < 1) return res.status(404).send({ error: 'Account is not exists' });

                if (data[0].status) {
                    return res.status(409).send({ error: 'Account is status open' });
                } else {
                    db.update({
                        status: true
                    })
                    .table('account')
                    .then(_ => res.status(200).send({ message: 'Openned account' }))
                    .catch(err => res.status(500).send({ error: 'Internal server error' }));
                }
            })
            .catch(err => res.status(500).send({ error: 'Internal server error' }));
        } else {
            return res.status(400).send({ error: 'Data not reported' });
        }
    }
}

function logInto() {
    return function(req, res) {
        const { numAccount, password } = req.body;
        if (numAccount && password) {
            db.select('*')
                .table('account')
                .where({ num_account: numAccount })
                .then(data => {
                    if (data.length < 1) return res.status(404).send({ error: 'Account is not exists' });

                    bcrypt.compare(password, data[0].password, (err, result) => {
                        if (err) return res.status(500).send({ error: 'internal server error' });

                        if (result) {
                            const token = jwt.sign({
                                numAccount,
                                client: data[0].client
                            }, process.env.JWT_KEY, {
                                expiresIn: '1h'
                            });

                            return res.status(200).send({
                                token,
                                numAccount,
                                typeAccount: data[0].type_account,
                                client: data[0].client,
                                balance: data[0].balance,
                                status: data[0].status
                            });
                        } else {
                            return res.status(400).send({ error: 'Incorrect password' });
                        }
                    });
                })
                .catch(err => res.status(500).send({ error: 'Internal server error' }));
        } else {
            return res.status(400).send({ error: 'Data not reported' });
        }
    }
}

function details() {
    return function(req, res) {
        const { numAccount } = req.account;
        if (numAccount) {
            db.select('*')
                .table('account')
                .where({ num_account: numAccount })
                .then(data => {
                    if (data.length < 1) return res.status(404).send({ error: 'Account is not exists' });

                    return res.status(200).send({
                        numAccount: data[0].num_account,
                        typeAccount: data[0].type_account,
                        client: data[0].client,
                        balance: data[0].balance,
                        status: data[0].status
                    });
                })
                .catch(err => res.status(500).send({ error: 'Internal server error' }));
        } else {
            return res.status(400).send({ error: 'Data not reported' });
        }
    }
}

module.exports = {
    createAccount,
    closeAccount,
    openAccount,
    logInto,
    details
}