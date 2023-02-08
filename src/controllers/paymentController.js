const axios = require('axios');
const dotenv = require('dotenv').config();

const createOrder = async (req, res) => {
    console.log(process.env.PAYPAL_API_CLIENT);

    try {
        const order = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: '105.70',
                    },
                },
            ],
            application_context: {
                brand_name: 'mycompany.com',
                landing_page: 'NO_PREFERENCE',
                user_action: 'PAY_NOW',
                return_url: `${process.env.HOST}/capture-order`,
                cancel_url: `${process.env.HOST}/cancel-payment`,
            },
        };

        // format the body
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');

        // Generate an access token
        const {
            data: { access_token },
        } = await axios.post(
            'https://api-m.sandbox.paypal.com/v1/oauth2/token',
            params,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                auth: {
                    username: process.env.PAYPAL_API_CLIENT,
                    password: process.env.PAYPAL_API_SECRET,
                },
            }
        );

        console.log(access_token);
        res.json({ access_token, order });
        // make a request
        // axios.post(`https://api-m.sandbox.paypal.com/v2/checkout/orders`,
        //     order,
        //     {
        //         headers: {
        //             Authorization: `Bearer ${access_token}`,
        //         },
        //     })
        //     .then(response => {
        //         // console.log(response.data);
        //         res.send('respuesta');
        //     })
        // const response = await axios.post(
        //     `https://api-m.sandbox.paypal.com/v2/checkout/orders`,
        //     order,
        //     {
        //         headers: {
        //             Authorization: `Bearer ${access_token}`,
        //         },
        //     }
        // );
        // //
        // console.log(response.data);
        // //
        // return res.send(response.data);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json('Something goes wrong');
    }
};

const captureOrder = async (req, res) => {
    const { token } = req.query;

    try {
        const response = await axios.post(
            `${process.env.PAYPAL_API}/v2/checkout/orders/${token}/capture`,
            {},
            {
                auth: {
                    username: process.env.PAYPAL_API_CLIENT,
                    password: process.env.PAYPAL_API_SECRET,
                },
            }
        );

        console.log(response.data);

        res.redirect('/payed.html');
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Internal Server error' });
    }
};

const cancelPayment = (req, res) => {
    res.redirect('/');
};


module.exports = {
    createOrder,
    captureOrder,
    cancelPayment,
}