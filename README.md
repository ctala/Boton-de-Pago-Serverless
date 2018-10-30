# Boton de Pago Serverless
Este es solo un ejemplo de lo simple que es crear un botón de pago 100% Serverless usando NodeJS + ExpressJS + Amazon Lambda + DynamoDB + Pago Fácil.

Es 100% funcional para la creación de las ordenes, y redirije automáticamente al pago.

# Requerimientos

* Tener NodeJS instalado
* Tener el Framework Serverless instalado
* No se necesita una cuenta en Amazon para las pruebas locales, sin embargo es requerida para hacer el deployment.
* Una cuenta en Pago Fácil para las credenciales y un servicio activo. Puede ser en el servidor de desarrollo.


# Instrucciones

* Haz un clone del repositorio o descarga el zip del branch
* Ejecuta NPM install para instalar todas las dependencias.
* Instala DynamoDB Local ejecutando el siguiente comando : sls dynamodb install

# Ejecutando

* Iniciar de manera local con : sls offline start
* El index puede ser accedido desde http://localhost:3000 . Recomendamos usar NGROK o similar para probar los callbacks y el return URL.

![Landing Botón de Pago Serverless](http://url/to/img.png)

# Ejercicio 

El código crea a través del API de Pago Fácil una transacción en la plataforma de manera 100% serverless usando Amazon Lambda y DynamoDB. Lo que no hace es cambiar el estado de la orden en la Base de Datos local ni mostrar un mensaje de éxito cuando esto sucede.

Deberás : 

* Cambiar el estado de la orden según la respuesta de Pago Fácil.
* Mostrar un mensaje de éxito, pendiente, o fracaso según sea el caso en la URL de Return.
* Usar API Gateway para darle una URL un poco más amigable para el usuario final.