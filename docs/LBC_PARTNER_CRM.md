# LBC Partner CRM

## Objetivo

El CRM de Living Business Club convierte la red de partners en un sistema medible de derivación, atención y retorno. Está diseñado como **multi-tenant desde el primer día** para que Living Paraguay sirva como piloto y el mismo producto pueda activarse después en cualquier delegación de LBC sin mezclar datos entre países, zonas o empresas.

## Roles

### LBC HQ / administrador global
- Visibilidad completa de todos los mercados.
- Benchmark entre delegaciones y partners.
- Acceso a candidaturas, partners, leads, membresías, SLA, conversión y facturación atribuida.

### Manager de delegación
- Acceso a su `market_slug`.
- Activa candidaturas en CRM.
- Administra partners y membresías.
- Crea y asigna leads.
- Controla cumplimiento de SLA y resultados.

### Staff de delegación
- Acceso operativo a leads del mercado.
- Puede crear y asignar leads y realizar seguimiento.
- No puede cambiar estructura de usuarios, partners o membresías.

### Partner owner / manager / sales
- Solo ve cuentas y leads de su propia empresa.
- Actualiza pipeline y resultados.
- Registra llamadas, WhatsApp, emails, reuniones, notas y propuestas.
- Crea tareas de seguimiento.
- Consulta facturación atribuida, conversión, SLA y ROI.

## Flujo comercial

1. El candidato se postula desde la web pública.
2. La delegación cualifica el lead comercial sin exponer precios en público.
3. Un manager pulsa **Activar CRM** sobre la candidatura.
4. Se crea `crm_partner_accounts` y la primera `crm_memberships`.
5. El partner crea su usuario con el mismo email de candidatura.
6. `crm_claim_partner_access()` vincula automáticamente el usuario con su empresa.
7. La delegación crea una derivación y la asigna a un partner compatible.
8. El partner dispone de 24 horas como SLA de primera respuesta.
9. Cada interacción queda en `crm_activities` y actualiza automáticamente la primera respuesta y último contacto.
10. Al cerrar el negocio se registra `won_value` y el CRM calcula conversión, facturación atribuida y ROI.

## Entidades principales

- `crm_delegation_users`: gestores y staff por mercado.
- `crm_partner_accounts`: empresa, rubro, zona, categoría, plazas y exclusividad.
- `crm_partner_users`: usuarios internos de cada partner.
- `crm_memberships`: histórico de membresía, inversión, exclusividad, garantía y renovaciones.
- `crm_leads`: ficha única del expatriado/cliente y su necesidad.
- `crm_lead_assignments`: relación entre lead y partner, pipeline y SLA.
- `crm_activities`: timeline comercial auditable.
- `crm_tasks`: agenda de seguimiento.
- `crm_feedback`: calidad, satisfacción y NPS preparados para la siguiente fase.

## Seguridad multi-tenant

Toda la capa CRM tiene RLS. No existe lectura pública.

- Los managers/staff solo acceden a su mercado.
- Los partners solo acceden a leads que tengan una asignación real a su cuenta.
- La base de datos valida que un lead solo pueda asignarse a un partner del mismo mercado, zona y rubro.
- Un partner puede mover su pipeline, pero no cambiar la empresa asignada, el lead, el creador o el SLA estructural.
- Las actividades del partner deben pertenecer a una asignación autorizada.
- La capacidad y la exclusividad de cada rubro se vuelven a validar en base de datos.

## Métricas del dashboard

- Leads activos.
- Conversión de leads cerrados.
- Facturación atribuida.
- Cumplimiento de SLA de primera respuesta.
- ROI directo de membresía + exclusividad.
- Tareas vencidas.
- Scorecard de cada partner por volumen, conversión y facturación.

## Preparado para expansión

El CRM no depende del nombre Living Paraguay. Cada registro está anclado a `market_slug` y los permisos se resuelven por mercado y partner. Para una nueva franquicia solo es necesario:

1. activar el nuevo mercado en `network_markets`;
2. registrar uno o más `crm_delegation_users`;
3. definir sus zonas/rubros y pricing en la capa comercial correspondiente;
4. activar sus partners desde las candidaturas locales.

La misma aplicación y base de datos pueden operar toda la red LBC con aislamiento por RLS.

## Próximas capas recomendadas

- Conversión automática de formularios de comunidad/contacto en leads CRM.
- WhatsApp Cloud API y email transaccional desde la ficha del lead.
- Motor de distribución inteligente por disponibilidad, score, SLA y rotación.
- Encuestas automáticas NPS/CSAT.
- Facturación/renovación y cobro de membresías.
- App/PWA de partners con notificaciones push.
- IA para resumen de conversaciones, siguiente mejor acción, riesgo de pérdida y coaching comercial.
- Benchmark LBC entre países sin exponer datos personales entre delegaciones.
