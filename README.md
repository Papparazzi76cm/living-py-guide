# Living Paraguay Business Club

Rol: Eres un ingeniero frontend senior de clase mundial, experto en React, TypeScript y Tailwind CSS, con un agudo sentido del diseño UI/UX.
Objetivo: Tu tarea es construir una aplicación web de una sola página (SPA) completa, moderna y visualmente atractiva llamada "Living Paraguay". El sitio servirá como una guía integral para expatriados que deseen mudarse a Paraguay. La aplicación debe ser completamente funcional, responsiva y estéticamente pulcra.
1. Especificaciones Técnicas y Arquitectura
Stack Principal:
Framework: React v18+ con TypeScript.
Estilos: Tailwind CSS. No uses librerías de componentes externas (como Material-UI o Ant Design); todos los componentes deben ser construidos a medida.
Inteligencia Artificial: Utiliza la biblioteca @google/genai para la funcionalidad del chatbot.
Estructura del Proyecto:
La aplicación debe funcionar como una SPA. La navegación entre secciones se gestionará mediante un estado de React en el componente principal App.tsx (ej. const [activePage, setActivePage] = useState<Page>('home')), no con una biblioteca de enrutamiento como React Router.
Organiza los archivos de la siguiente manera:
components/: Para todos los componentes de React.
services/: Para la lógica de comunicación con APIs (ej. geminiService.ts).
constants.ts: Para todos los datos estáticos (links de navegación, datos de propiedades, colegios, FAQs, etc.).
types.ts: Para todas las definiciones de tipos de TypeScript.
Diseño y UI/UX General:
Paleta de Colores: Basada en la bandera de Paraguay:
py-red: #D52B1E (Para CTAs principales y acentos)
py-blue: #0038A8
py-blue-dark: #00246B (Para fondos oscuros como el footer y texto principal)
py-white: #FFFFFF
Tipografía: Utiliza la fuente "Inter" para todo el texto.
Animaciones: Implementa un componente reutilizable AnimatedDiv que use IntersectionObserver para animar la entrada de los elementos con un efecto sutil de fade-in y slide-up a medida que el usuario se desplaza. Debe aceptar una propiedad delay.
Iconografía: Crea un componente Icon.tsx que renderice iconos SVG basados en una prop name. Incluye todos los iconos necesarios para la interfaz (menú, cerrar, documentos, redes sociales, etc.).
2. Estructura de Componentes y Funcionalidad
A. Componentes Globales:
Header.tsx:
Debe ser sticky en la parte superior, con un efecto backdrop-blur.
A la izquierda, el logo y el nombre "Living Paraguay".
En el centro (en escritorio), los enlaces de navegación (Inicio, Permisos, etc.). El enlace activo debe tener un subrayado rojo.
A la derecha (en escritorio), un botón de CTA principal "Iniciar Trámite".
En móvil, debe mostrar un menú de hamburguesa que despliega los enlaces de navegación.
Footer.tsx:
Fondo py-blue-dark con texto blanco/gris claro.
Diseño de 4 columnas:
Logo y descripción corta.
Enlaces de navegación.
Enlaces legales (Política de Privacidad, etc.).
Iconos de redes sociales (Facebook, Instagram, YouTube) con un efecto de hover.
Una línea de copyright en la parte inferior.
Chatbot.tsx:
Un botón de acción flotante (FAB) fijo en la esquina inferior derecha. Al hacer clic, abre y cierra la ventana del chat.
La ventana del chat debe ser un panel emergente que muestra el historial de la conversación.
El chatbot debe tener un mensaje de bienvenida inicial.
Debe conectarse al geminiService.ts para obtener respuestas.
Muestra un indicador de carga mientras espera la respuesta del modelo.
Implementa el servicio geminiService.ts con el siguiente system prompt para el modelo:
code
Code
Eres "Guaraní Guide", un asistente experto para expatriados que se mudan a Paraguay. Tu conocimiento se basa en guías oficiales de residencia. Responde de forma amable, concisa y precisa en español.
**Temas que dominas:**
- **Residencia Temporal:** Duración (2 años), es el primer paso, requiere pasaporte, certificados apostillados (nacimiento, penales) y solvencia económica (aprox. $5,000 USD). Permite obtener la Cédula de Identidad.
- **Residencia Permanente:** Para establecerse a largo plazo. Se puede obtener tras 2 años de temporalidad, o de forma directa para inversionistas a través del sistema SUACE, presentando una "Constancia de Inversionista".
- **Cédula de Identidad Paraguaya:** Es la "llave dorada" para la integración total (abrir cuentas bancarias, etc.).
- **Documentación Clave:** La "Apostilla de La Haya" es crucial. Todos los documentos deben ser traducidos por un "Traductor Público matriculado".
- **Otros temas:** Costo de vida, búsqueda de vivienda, colegios y cultura paraguaya.
Si una pregunta es muy específica o requiere asesoría legal, recomienda contactar a un asesor a través del formulario del sitio web. Si no sabes una respuesta, dilo honestamente. Evita temas no relacionados con la expatriación a Paraguay.
B. Secciones de la Página (controladas por App.tsx):
HeroSection.tsx (Página 'home'):
Ocupa casi toda la altura de la ventana.
Presenta un carrusel de imágenes de fondo a pantalla completa con un ligero overlay oscuro para legibilidad.
Título principal audaz, subtítulo descriptivo y dos botones CTA ("Obtener Residencia", "Buscar Vivienda").
Indicadores de puntos en la parte inferior para el carrusel.
PermitSection.tsx (Página 'permits'):
Sección informativa detallada.
Diseño de dos columnas:
La columna principal (más ancha) contiene InfoCards que explican la Residencia Temporal, Permanente (vía estándar y vía SUACE para inversionistas) y la Cédula de Identidad. Usa iconos y números de paso. Incluye una tabla comparativa.
La columna lateral (más estrecha) contiene un formulario de contacto sticky para "Iniciar Consulta Gratuita".
HousingSearch.tsx (Página 'housing'):
Una interfaz para buscar propiedades.
Una barra de filtros sticky en la parte superior con opciones para Ciudad, Operación (Alquiler/Venta), Tipo de Propiedad y un slider para Precio Máximo.
Una cuadrícula de PropertyCard que muestra los resultados. Cada tarjeta debe mostrar una imagen, precio, tipo, título, ubicación y características clave (ej. m², tipo).
Debe mostrar un mensaje si no se encuentran propiedades.
SchoolList.tsx (Página 'schools'):
Similar a la sección de vivienda pero para colegios.
Un filtro simple por ciudad.
Una cuadrícula de SchoolCard mostrando imagen, nombre, ubicación, idiomas, niveles y ranking.
NeighborhoodGuide.tsx (Página 'neighborhoods'):
Combina dos tipos de información:
Costo de Vida: Una sección con CostOfLivingCard para diferentes ciudades, desglosando costos estimados de alquiler, comida, etc.
Barrios Destacados: Una cuadrícula de NeighborhoodCard con imagen, descripción y etiquetas de características para barrios populares.
TaxSection.tsx (Página 'taxation'):
Una sección educativa compleja sobre impuestos.
Calculadora de Impuestos: Incluye un componente TaxCalculator interactivo en la parte superior. Esta calculadora debe tener:
Dos modos: "Empleado (IRP)" y "Independiente (IVA)".
Selector de moneda (PYG, USD, EUR) con conversión automática de valores.
Para IRP: campos para ingreso anual y una lista dinámica para añadir/eliminar gastos deducibles.
Para IVA: campos para ingresos y gastos mensuales.
Cálculo y desglose en tiempo real del impuesto estimado a pagar.
Contenido Informativo: Debajo de la calculadora, implementa un sistema de pestañas para navegar entre "Principios Clave", "Residencia Fiscal vs. Migratoria", "Impuestos Principales" y "Glosario Tributario", cada uno mostrando InfoCards con la información relevante.
SocialSecuritySection.tsx (Página 'social-security'):
Explica el sistema IPS.
Utiliza InfoCards para detallar:
Porcentajes de aportes de empleado y empleador.
Beneficios cubiertos (salud, jubilación).
Puntos clave como la obligatoriedad para empleados y la voluntariedad para independientes.
FaqSection.tsx (Página 'faq'):
Presenta una lista de preguntas frecuentes en un formato de acordeón.
Solo una pregunta puede estar abierta a la vez. El ícono cambia entre plus y minus.
ContactSection.tsx (Página 'contact'):
Un formulario de contacto con campos para nombre, email, asunto y mensaje.
Debe tener validación de campos del lado del cliente.
Muestra estados de envío (ej. "Enviando...") y un mensaje de éxito.
Junto al formulario, muestra una tarjeta con información de contacto directa (email, teléfono).

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/27aa217f-4179-4a86-b97d-99d402f1860c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
