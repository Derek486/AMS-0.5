import pandas as pd
import numpy as np
import math

def calcular_rms(grupo):
    suma_cuadrados = sum(math.pow(valor,2) for valor in grupo)
    rms = math.sqrt(suma_cuadrados/len(grupo))
    return rms

def asignar_estado(rms):
    if rms < 0.10:
        return 'Normal'
    elif rms < 0.15:
        return 'Alerta'
    else:
        return 'Critico'

def asignar_tipo_fallo(rms,axis):
    if rms >= 0.16 and rms <= 0.25 and axis == 'z' :
        return 'Desalineacion del eje'
    elif rms >= 0.12 and rms <= 0.20 and axis in ['x','y'] :
        return 'Desgaste de rodamiento'
    else:
        return 'Ninguno'
    
def generar_caracteristicas(df):
    try:
        if not {'Timestamp','Value'}.issubset(df.columns):
            raise ValueError("Las columnas 'Timestamp' y 'Value' no están presentes en el DataFrame")
        
        ## Aqui falta considerar la cantidad de datos necesarios
        print('Dataframe cargado con exito',df.head())
        print('Columnas encontradas en el dataset',df.columns.to_list())

        df['Rms'] = df.groupby('Timestamp')['Value'].transform(calcular_rms)
        df['Estado'] = df['Rms'].apply(asignar_estado)
        df['Tipo_fallo'] = df.apply(lambda row: asignar_tipo_fallo(row['Rms'],row['Axis']),axis=1)
        print("Columnas generadas",df.head())
        return df   
    except Exception as e:
        print(f"Error al generar características en el DataFrame con columnas {df.columns.tolist()}: {e}")
        return None 