function enviarData(dataType) {
    const mensaje = {
        data_type: dataType
    };

    fetch(`/send_prediction_data`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(mensaje)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error en la respuesta del servidor");
        }
        return response.json();
    })
    .then(data => {
        console.log("Mensaje enviado al backend:", data);
    })
    .catch(error => {
        console.error("Error al enviar datos:", error);
    });
}



