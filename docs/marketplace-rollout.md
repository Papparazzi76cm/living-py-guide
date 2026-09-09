# Living Paraguay: marketplace de servicios

## Alcance de esta entrega

- Cuenta gratuita con el sistema de autenticación existente.
- Perfil profesional y servicios con moderación antes de publicarse.
- Catálogo real con filtros de ciudad e idioma; no utiliza proveedores de demostración.
- Solicitud privada entre cliente, proveedor y administrador.
- Presupuesto en USD o guaraníes: honorarios, impuestos, gastos, plazo, condiciones y caducidad.
- Cálculo de comisión en PostgreSQL exclusivamente sobre honorarios. Total del cliente y honorarios netos del proveedor calculados por el servidor.
- Aceptación del presupuesto, cancelación antes de aceptar, rechazo del proveedor y confirmación de recepción del cliente.
- Protección contra aceptar una versión anterior del presupuesto, cambios de precio tras aceptar y acceso de terceros.

## Activación pendiente

La migración se ha probado en PostgreSQL aislado mediante PGlite. NO se ha aplicado al proyecto remoto: la conexión Supabase disponible no incluye la base de datos vinculada a esta web. Ningún dato real ha sido modificado.

1. Conectar el proyecto Supabase/Lovable Cloud correcto y comprobar sus migraciones existentes. Esta migración depende de `auth.users`, `auth.uid()` y de la función existente `public.has_role(..., 'admin')`.
2. Revisar y aplicar `supabase/migrations/20260909204324_expat_services_marketplace.sql` mediante el procedimiento habitual del proyecto. Comprobar grants, RLS y asesores en la base real antes de publicar.
3. Verificar la configuración de confirmación de email y las URL de redirección de Auth para `/acceso` en el dominio real. No desactivar confirmación para evitar este paso.
4. Iniciar sesión con un administrador existente. Desde **Mi cuenta → Revisión de publicaciones**, aprobar el perfil y después los servicios.
5. Ejecutar una prueba real con cuentas separadas de cliente y proveedor: alta, publicación, solicitud, presupuesto y aceptación. Confirmar que la sesión de un tercero no ve esas solicitudes.
6. Publicar el frontend una vez verificada la migración. Si las tablas faltan, la interfaz muestra indisponibilidad y conserva el enlace de contacto; no inventa resultados.

## Comisiones

La fuente efectiva para los presupuestos es `marketplace_categories.commission_percent` en el servidor. Las tarifas iniciales coinciden con la propuesta de `src/data/marketplace.ts`. Una tarifa NULL exige un acuerdo comercial previo y bloquea la emisión de presupuestos. Cualquier revisión de tarifas debe actualizar la información pública y la configuración del servidor conjuntamente. Cada presupuesto guarda su propio porcentaje y versión; no se recalculan los ya aceptados.

En vivienda se aplica a los honorarios del profesional, nunca al precio del inmueble o al alquiler. Los impuestos y gastos de terceros quedan fuera de la base. Los netos mostrados son honorarios netos de comisión, no liquidaciones bancarias.

## Límites deliberados

Aceptar un presupuesto no cobra dinero ni reserva automáticamente una fecha. No hay checkout, escrow, reembolsos automáticos, notificaciones por email/WhatsApp ni reseñas. El pago online y la coordinación posterior a la aceptación requieren la siguiente integración. Las cancelaciones después de aceptar deben gestionarse con LBC conforme a las condiciones del presupuesto; no se simula una devolución.

Los registros históricos de membresías y el CRM anterior se conservan. Las nuevas solicitudes se gestionan en **Mi cuenta** y no se duplican como leads del CRM antiguo. No se invoca su activación de membresías de pago.

## Validación reproducible

```sh
npm ci
npm run typecheck
npm run lint
npm run test:marketplace
npm run build
npm audit --audit-level=moderate
```

`test:marketplace` ejecuta la migración completa en PostgreSQL aislado con roles `anon`, `authenticated`, proveedor, cliente, tercero y administrador. Los helpers de Auth están simulados; no sustituye la prueba de integración con Auth/PostgREST en el proyecto real. La CI mantiene la auditoría de dependencias y añade TypeScript y las pruebas de permisos.
