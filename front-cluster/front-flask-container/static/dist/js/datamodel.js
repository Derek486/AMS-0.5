function enviarData(dataType, motor) {
    const mensaje = {
        data_type: dataType,
        motor
    };

    fetch(`/send_prediction_data`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(mensaje)
    })
    .then(_ => {
        console.log(dataType, " enviado exitosamente");
    })
    .catch(error => {
        console.error("Error al enviar datos:", error);
    });
}



