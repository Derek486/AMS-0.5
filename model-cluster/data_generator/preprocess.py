import pandas as pd
import joblib
import os

# Definir la ruta base actual
base_path = os.path.dirname(os.path.abspath(__file__))

metadata_path = os.path.join("/app", "data_generator", "model_metadata.pkl")

def procesar_datos(df):
    try:
        print("Columnas iniciales:", df.columns)
        print("Primeras filas:\n", df.head())

        # Cargar metadata del modelo
        metadata = joblib.load(metadata_path)
        scaler = metadata['scaler']
        encoder_estado = metadata['encoder_estado']
        encoder_axis = metadata['encoder_axis']
        column_order = metadata['column_order_binario']

        if 'Timestamp' not in df.columns or 'Value' not in df.columns:
            raise ValueError("Faltan las columnas necesarias ('Timestamp', 'Value')")

        # Asegurar que los nombres de las columnas coincidan con los nombres esperados durante el entrenamiento
        df = df.rename(columns={'Rms': 'rms', 'Value': 'value'})

        # Escalar las columnas 'value' y 'rms'
        df[['value', 'rms']] = scaler.transform(df[['value', 'rms']])
        print("Después de la escalación de 'value' y 'rms':\n", df[['value', 'rms']].head())

        # Renombrar las columnas de nuevo para que coincidan con el formato final esperado
        df = df.rename(columns={'rms': 'Rms', 'value': 'Value'})

        # Codificar la columna 'Estado' usando el codificador ajustado
        df['Estado'] = encoder_estado.transform(df['Estado'].values)
        print("Después de la codificación ordinal de 'Estado':\n", df[['Estado']].head())

        # Codificar la columna 'Axis' usando el codificador ajustado
        df['Axis'] = encoder_axis.transform(df['Axis'])
        print("Después de la codificación de 'Axis':\n", df[['Axis']].head())

        # Reordenar las columnas para asegurar compatibilidad con el modelo
        df = df[column_order]
        print("Datos reordenados para el modelo:\n", df.head())

        print("Datos después del preprocesamiento:\n", df.head())

        return df  # Retorna el DataFrame preprocesado listo para el modelo

    except Exception as e:
        print(f"Error en el preprocesamiento: {e}")
        return None
