# LBC · Living Business Club — arquitectura de expansión LATAM

## Objetivo

La plataforma deja de concebirse como un producto exclusivamente paraguayo y pasa a funcionar como una base multi-mercado bajo la marca matriz **LBC · Living Business Club**.

- **Matriz:** LBC · Living Business Club.
- **Delegación fundadora:** Living Paraguay.
- **Delegaciones previstas:** Living Argentina, Living Brasil y Living México.
- **Modelo de expansión:** franquicias/delegaciones locales con estándares comunes y operación territorial.

## Regla de marca

Cada delegación usa el símbolo común de la red y un lockup local `Living + País`. La paleta se resuelve mediante tokens de tema por mercado; no se deben duplicar componentes para cambiar colores.

El selector de mercado de despliegue es `VITE_ACTIVE_MARKET`.

Valores previstos:

- `paraguay`
- `argentina`
- `brasil`
- `mexico`

Paraguay es el único mercado marcado como `active`. Los mercados planificados quedan detrás de una pantalla de pre-lanzamiento para impedir que se publique accidentalmente contenido, partners o precios paraguayos en otro país.

## Pricing

**Los precios no se heredan entre países.**

Para activar precios en un nuevo mercado se debe completar un estudio específico que incluya, como mínimo:

1. poder adquisitivo y costes operativos locales;
2. ticket medio de cada categoría profesional;
3. capacidad estimada de retorno para el partner;
4. densidad de expatriados y demanda potencial;
5. competencia local y coste de adquisición de clientes;
6. moneda de cobro, inflación y riesgo cambiario;
7. límites de empresas por rubro y valor económico de la exclusividad.

Hasta completar ese estudio, `pricingStatus` debe permanecer en `pending-market-study`.

## Datos y Supabase

La migración multi-país crea `network_markets` y añade contexto de mercado a los registros principales:

- `market_slug`
- `market_name`
- `country_code`
- `network_brand_slug`

El backend deriva nombre de mercado, país y marca matriz desde `market_slug`, evitando que el frontend pueda guardar combinaciones incoherentes.

La unicidad de candidaturas de partners incorpora el mercado además del rubro y la zona, permitiendo que una misma empresa se postule de forma independiente en distintos países y territorios.

## Checklist para abrir un nuevo Living

Antes de cambiar un mercado a `active`:

1. aprobar operador/franquiciado y territorio;
2. aprobar identidad local y paleta;
3. crear contenido legal, fiscal, migratorio y editorial específico del país;
4. definir zonas comerciales y límites de plazas;
5. realizar el estudio de pricing y cargar tarifas A/B/C/D;
6. revisar requisitos lingüísticos locales;
7. crear políticas de exclusividad por territorio;
8. revisar dominio, SEO, schema y analítica;
9. validar flujos Supabase y RLS para el nuevo `market_slug`;
10. ejecutar CI, QA funcional y revisión de datos antes del lanzamiento.

## Principio de producto

LBC debe mantener una sola arquitectura de software siempre que sea posible. Las diferencias por país deben resolverse mediante configuración de mercado, datos, tema y pricing, no mediante forks del código salvo que exista una necesidad legal o técnica real.
