const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv/config');

const tokenVerify = require('./middlewares/tokenVerify');
const apiAccount = require('./api/account');
const apiAction = require('./api/actions');
const PORT = process.env.PORT_SERVER || 8081;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.route('/account/create')
    .post(apiAccount.createAccount());

app.route('/account/close')
    .post(tokenVerify, apiAccount.closeAccount());

app.route('/account/open')
    .post(tokenVerify, apiAccount.openAccount());

app.route('/account/logInto')
    .post(apiAccount.logInto());

app.route('/account/details')
    .post(tokenVerify, apiAccount.details());

app.route('/action/getMoney')
    .post(tokenVerify, apiAction.getMoney());

app.route('/action/setMoney')
    .post(tokenVerify, apiAction.setMoney());

app.route('/action/transferMoney')
    .post(tokenVerify, apiAction.transferMoney());

app.listen(PORT, () => console.log(`Listening port ${PORT}`));