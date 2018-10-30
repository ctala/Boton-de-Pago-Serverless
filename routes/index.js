const express = require('express');
const router = express.Router();
const Orders = require("../models/Orders");
const PagoFacil = require("../models/PagoFacil");


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Botón de Pago Serverless',
    body: {

    }
  });
});

/* POST home page. */
router.post('/', function (req, res, next) {

  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  let orderProps = {
    email: req.body.email,
    monto: req.body.monto,
    cliente: {
      firstName: req.body.firstName,
      lastName: req.body.lastName
    }
  };

  console.log("ORDER PROPS", orderProps);

  let order = new Orders(orderProps);
  let pagoFacil = new PagoFacil();

  order.save().then(resultado => {
    console.log("Resultado", resultado);
    let pfOrderParams = {
      x_url_callback: fullUrl + "callback?orderId=" + order.orderId,
      x_url_cancel: fullUrl + "return?orderId=" + order.orderId,
      x_url_complete: fullUrl + "return?orderId=" + order.orderId,
      x_customer_email: order.email,
      x_reference: order.orderId,
      x_amount: order.monto
    }

    pagoFacil.createOrder(pfOrderParams).then(postResult => {
      order.addTrxId(postResult.idTrx).then(finalResult => {
        res.redirect(postResult.payUrl);
      }).catch(errorAddId => {
        console.log("Error Agregando ID", errorAddId);
        res.render('index', {
          title: 'fracaso',
          body: req.body
        });
      });

    }).catch(errorRequest => {
      res.render('index', {
        title: 'fracaso',
        body: req.body
      });
    })


  }).catch(errorSave => {
    console.log("Orden no se pudo salvar", errorSave);
    res.status(500);
    res.send(errorSave);
  });


});


router.post('/callback', function (req, res, next) {
  console.log("Callback ejecutado", req.body);
  res.send("Ok");
});

 

router.all('/return', function (req, res, next) {
  console.log("Return URL", req.body);
  res.send("Ok");
});


module.exports = router;