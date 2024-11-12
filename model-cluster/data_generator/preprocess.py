import pandas as pd
from sklearn.preprocessing import StandardScaler,LabelEncoder,OrdinalEncoder

scaler = StandardScaler ()
encoder_estado_fallo = OrdinalEncoder ()
encoder_axis = LabelEncoder ()

def procesar_datos(df):
    try:
        print("Columnas iniciales:", df.columns)
        print("Primeras filas:\n", df.head())

        if 'Timestamp' in df.columns and 'Medicion' in df.columns:
            df = df.drop(columns=['Timestamp', 'Medicion'])
            print("Columnas después de eliminar 'Timestamp' y 'Medicion':", df.columns)

        # Verificar si las columnas 'Estado', 'Tipo_fallo' y 'Axis' están en el DataFrame
        if not {'Estado', 'Tipo_fallo', 'Axis'}.issubset(df.columns):
            print("Error: Las columnas 'Estado', 'Tipo_fallo' y 'Axis' no se encuentran en el archivo.")
            return None
        
        # Codificar las columnas 'Estado' y 'Tipo_fallo'
        df[['Estado', 'Tipo_fallo']] = encoder_estado_fallo.fit_transform(df[['Estado', 'Tipo_fallo']])
        print("Después de la codificación ordinal de 'Estado' y 'Tipo_fallo':\n", df[['Estado', 'Tipo_fallo']].head())

        # Codificar la columna 'Axis' si no está en formato numérico
        df['Axis'] = encoder_axis.fit_transform(df['Axis'])
        print("Después de la codificación de 'Axis':\n", df[['Axis']].head())

        # Escalar las columnas 'Value' y 'Rms'
        df[['Value', 'Rms']] = scaler.fit_transform(df[['Value', 'Rms']])
        print("Después de la escalación de 'Value' y 'Rms':\n", df[['Value', 'Rms']].head())

        print("Datos después del preprocesamiento:\n", df.head())
        return df  # Retorna el DataFrame preprocesado listo para el modelo

    except Exception as e:
        print(f"Error en el preprocesamiento: {e}")
        return None