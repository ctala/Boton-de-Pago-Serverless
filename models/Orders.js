const AWS = require('aws-sdk');
const IS_OFFLINE = process.env.IS_OFFLINE;
const uuidv4 = require('uuid/v4');




class Orders {
    constructor(props = {}) {

        this.tableName = process.env.ORDERS_TABLE;

        this.new = (props.orderId == "undefined" || props.orderId == null ? true : false);
        this.orderId = props.orderId || uuidv4();
        this.monto = props.monto || 1000;
        this.email = props.email;
        this.estado = props.estado || "PENDIENTE";
        this.cliente = props.cliente || null;

        this.currency = props.currency || "CLP";
        let currentUnixTimeStamp = Math.round(new Date().getTime() / 1000);
        this.updatedAt = currentUnixTimeStamp;

        this.createdAt = props.createdAt || currentUnixTimeStamp;

        let docClient;
        if (IS_OFFLINE === 'true') {
            docClient = new AWS.DynamoDB.DocumentClient({
                region: 'localhost',
                endpoint: 'http://localhost:8000'
            })

        } else {
            docClient = new AWS.DynamoDB.DocumentClient();
        }

        this.docClient = docClient;
    }


    save() {
        if (this.new) {
            console.log("Es Nuevo");
            return this.saveNew();
        } else {
            console.log("Ya existe");
            return this.update();
        }
    }

    saveNew() {
        return new Promise((resolve, reject) => {

            var params = {
                TableName: this.tableName,
                Item: {
                    "orderId": this.orderId,
                    "monto": this.monto,
                    "email": this.email,
                    "currency": this.currency,
                    "updatedAt": this.updatedAt,
                    "createdAt": this.updatedAt,
                    "estado": this.estado,
                    "cliente": this.cliente
                },
            };

            console.log("Creating the item...", params);

            this.docClient.put(params, (err, data) => {
                if (err) {
                    console.error("Unable to create item. Error JSON:", err);
                    reject(err);
                } else {
                    this.new = false;
                    console.log("CreateItem succeeded:", data);
                    resolve(data);
                }
            });
        }); //End Promise 
    }


    update() {
        return new Promise((resolve, reject) => {
            let updateExpression = "set monto = :monto, estado = :estado, email = :email, currency = :currency, updatedAt =:updatedAt";

            var params = {
                TableName: this.tableName,
                Key: {
                    "orderId": this.orderId
                },
                UpdateExpression: updateExpression,
                ExpressionAttributeValues: {
                    ":monto": this.monto,
                    ":email": this.email,
                    ":currency": this.currency,
                    ":updatedAt": this.updatedAt,
                    ":estado": this.estado,
                },
                ReturnValues: "UPDATED_NEW"
            };

            console.log("Updating the item...", params);

            this.docClient.update(params, (err, data) => {
                if (err) {
                    console.error("Unable to update item. Error JSON:", err);
                    reject(err);
                } else {
                    console.log("UpdateItem succeeded:", data);
                    resolve(data);
                }
            });
        }); //End Promise
    }

    addTrxId(idTrx) {
        return new Promise((resolve, reject) => {
            let updateExpression = "set idTrx = :idTrx";

            var params = {
                TableName: this.tableName,
                Key: {
                    "orderId": this.orderId
                },
                UpdateExpression: updateExpression,
                ExpressionAttributeValues: {
                    ":idTrx": idTrx
                },
                ReturnValues: "UPDATED_NEW"
            };

            console.log("Updating the item with idTrx...", params);

            this.docClient.update(params, (err, data) => {
                if (err) {
                    console.error("Unable to update item. Error JSON:", err);
                    reject(err);
                } else {
                    console.log("UpdateItem succeeded:", data);
                    resolve(data);
                }
            });
        }) //END PROMISE
    }

    get(orderId) {

        return new Promise((resolve, reject) => {
            let params = {
                TableName: this.tableName,
                Key: {
                    "orderId": orderId
                }
            };

            this.docClient.get(params, (err, data) => {
                if (err) {
                    console.error("Unable to read item. Error JSON:", err);
                    reject(err);
                } else {
                    console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                    resolve(data.Item);
                }
            });
        });

    }
}


module.exports = Orders;