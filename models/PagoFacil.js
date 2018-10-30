var request = require("request");




class PagoFacil {
    constructor() {
        this.createUrl = process.env.PAGOFACIL_API_URL + "/trxs/create";
        this.Authorization = process.env.JWT_TOKEN;
        this.account_id = process.env.SERVICE_ID;
    }

    createOrder(pfOrderParams) {
        return new Promise((resolve, reject) => {
            let options = {
                method: 'POST',
                url: this.createUrl,
                headers: {
                    'Cache-Control': 'no-cache',
                    Authorization: 'Bearer ' + this.Authorization,
                    'Content-Type': 'application/json'
                },
                body: {
                    x_account_id: this.account_id,
                    x_url_callback: pfOrderParams.x_url_callback,
                    x_url_cancel: pfOrderParams.x_url_cancel,
                    x_customer_email: pfOrderParams.x_customer_email,
                    x_reference: pfOrderParams.x_reference,
                    x_amount: pfOrderParams.x_amount,
                    x_url_complete: pfOrderParams.x_url_complete,
                },
                json: true
            };

            console.log("Create Order Params", options);

            request(options, function (error, response, body) {
                if (error) {
                    console.log("Error request", error);
                    reject(error);
                } else {
                    console.log(body);
                    resolve(body);
                }

            });
        })

    }


}


module.exports = PagoFacil;