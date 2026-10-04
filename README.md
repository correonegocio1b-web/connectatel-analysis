# Proyecto 6 — Análisis de una empresa de telecomunicaciones (ConnectaTel)

Análisis exploratorio y de segmentación del comportamiento de uso de clientes móviles (llamadas y mensajes) de **ConnectaTel**, operador con presencia en México y Colombia. Ventana de datos analizada: **enero a junio de 2024**.

## Objetivo

Identificar patrones de uso, detectar comportamientos atípicos, comprender qué segmentos de clientes muestran necesidades diferenciadas y proponer acciones para optimizar la oferta comercial.

## Datasets utilizados

- `plans.csv` — catálogo de planes (precio, minutos, mensajes, GB incluidos).
- `users_latam.csv` — perfil de clientes (edad, ciudad, plan, fecha de registro, churn).
- `usage.csv` — detalle de uso real (llamadas y mensajes).

## Etapas del análisis

1. **Carga y exploración** de los 3 datasets (`.head()`, `.shape`, `.info()`).
2. **Diagnóstico de calidad:** nulos, sentinels (`age=-999`, `city='?'`), fechas fuera de rango, `churn_date` en nanosegundos con coma decimal, verificación MAR de `duration`/`length`.
3. **Limpieza reglada:** `-999` → mediana, `'?'` → NaN, fechas 2026 → NaT.
4. **Perfil por usuario:** agregación de `cant_mensajes`, `cant_llamadas`, `cant_minutos_llamada`.
5. **Estadísticas resumen:** describe global, por plan y distribución del plan.
6. **Visualización:** histogramas por plan (edad, mensajes, llamadas, minutos), boxplots y detección de outliers con IQR.
7. **Segmentación:** `grupo_uso` (Bajo / Uso medio / Alto uso) y `grupo_edad` (Joven / Adulto / Adulto Mayor), con countplots.
8. **Insight ejecutivo:** respuesta a las preguntas de negocio y recomendaciones comerciales.

## Hallazgos principales

- 4,000 clientes: 64.9% en plan Basico, 35.1% en Premium. Tasa de churn observada: 11.65%.
- Mediana de uso por cliente en 6 meses: ~20 min de llamadas y 5 mensajes.
- **0% de la base excede su plan**: el usuario más activo llega a ~26 min/mes, muy por debajo de los 100 min/mes de Basico.
- Los segmentos son homogéneos: ni el plan, ni el país, ni la edad diferencian el consumo.
- Segmentación por uso: Uso medio 73.6% (2,943), Bajo uso 19.5% (779), Alto uso 6.9% (278).

## Recomendaciones al negocio

- Lanzar un plan **Light** (~30 min y 30 mensajes por ~US$6) para el 73.6% de la base que hoy paga por cupos que no consume.
- Rediferenciar Premium con datos y beneficios (no con más minutos).
- Segmentar campañas por comportamiento (Bajo/Medio/Alto uso), no por edad.
- Anti-churn dirigido al segmento de Bajo uso.
- Gobernanza de datos: estandarizar `churn_date` a ISO 8601 y bloquear altas con fecha futura.

## Cómo ejecutar el notebook

Requisitos: Python 3.9+, `pandas`, `numpy`, `matplotlib`, `seaborn`, `jupyter`.

```bash
pip install pandas numpy matplotlib seaborn jupyter
jupyter notebook connectatel-analysis.ipynb
```

También se puede abrir directamente en **Google Colab** con `File → Open notebook → GitHub`.

Los datasets (`plans.csv`, `users_latam.csv`, `usage.csv`) fueron provistos por la plataforma de TripleTen y no se redistribuyen en este repositorio; el notebook los lee desde `/datasets/`. Todas las salidas y gráficas ya están renderizadas en el notebook, así que puede revisarse sin ejecutarlo.

## Contenido del repositorio

- `connectatel-analysis.ipynb` — notebook completo con código, salidas, gráficas y resumen ejecutivo.

## Herramientas

Jupyter Notebook · Python · pandas · numpy · seaborn · matplotlib

---

*Proyecto del programa de Data Analytics de TripleTen. Revisado y aprobado.*
