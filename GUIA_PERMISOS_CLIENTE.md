# Guía de Funcionamiento y Permisos del Sistema (ConnectPro)

Este documento detalla el funcionamiento general de la plataforma **ConnectPro**, así como la jerarquía de usuarios y los permisos específicos que tiene cada rol dentro del sistema.

## 🏢 Arquitectura del Sistema (Multi-Tenant)

ConnectPro es una plataforma B2B2C (Business-to-Business-to-Consumer). Esto significa que el software no es una sola comunidad o red social, sino una plataforma que permite crear **múltiples redes o "Compañías" independientes**.

1. **La Plataforma Principal:** Administrada por los dueños del software.
2. **Los Clientes (Compañías/Empresas):** Negocios que compran una suscripción para usar el software y tener su propia de red social/comunidad privada (con su propio subdominio o dominio personalizado).
3. **Los Usuarios Finales (Miembros):** Personas que se registran dentro de la red privada de una compañía en específico.

---

## 👥 Jerarquía de Roles y Permisos

Existen **3 niveles de usuarios** en la base de datos de ConnectPro:

### 1. 👑 Súper Administrador (Dueño de la Plataforma)
**Quiénes son:** Los creadores y dueños del SaaS (ConnectPro). Ellos controlan quién puede usar el software.
**Acceso:** Tienen un panel de control global (`/super-admin`). No pertenecen a una compañía en específico, sino que administran todas las compañías.

**Permisos:**
- ✅ **Gestión de Compañías:** Crear nuevas compañías/clientes, suspender cuentas o eliminar empresas.
- ✅ **Gestión de Facturación (Billing):** Configurar planes de suscripción (ej. Básico, Pro, Enterprise) utilizando Stripe.
- ✅ **Gestión de Modulos/Aplicaciones:** Habilitar o deshabilitar módulos específicos (ej. podcasts, eventos) para empresas específicas dependiendo de lo que paguen.
- ✅ **Gestión de Suscripciones (Congelamiento):** Ver qué empresas están morosas. El sistema congela automáticamente el acceso a empresas que tengan más de 5 días con la suscripción expirada.
- ❌ **Restricción:** No pueden (por defecto) entrar a ver los mensajes privados de los usuarios dentro de las compañías, y su rol es puramente a nivel infraestructura y facturación.

---

### 2. 🛡️ Administrador de Compañía (El Cliente)
**Quiénes son:** Los clientes que pagan la suscripción. Son los gerentes o creadores de cada red/comunidad privada.
**Acceso:** Tienen un panel de control corporativo (`/admin`). Pertenecen únicamente a su propia Compañía (`companyId` específico).

**Permisos:**
- ✅ **Gestión de la Comunidad:** Configurar el nombre de su comunidad, logo y dominio personalizado.
- ✅ **Gestión de Miembros:** Ver todos los usuarios registrados en *su* red. Pueden bloquear, eliminar o aprobar a miembros de su comunidad.
- ✅ **Gestión de Eventos:** Crear eventos presenciales o virtuales en el calendario de su red, editar detalles, fecha y ubicación.
- ✅ **Gestión de Contenido:** Crear, editar y borrar Blogs y Podcasts para que sus miembros puedan consumirlos.
- ✅ **Recursos:** Subir archivos o documentos útiles para su comunidad.
- ✅ **Términos y Condiciones:** Modificar los términos legales específicos de su propia red.
- ❌ **Restricción:** No pueden ver ni modificar información, usuarios o publicaciones de otras Compañías. Solamente tienen poder dentro de su ecosistema aislado.
- ❌ **Restricción:** Si su plan de facturación expira y excede el periodo de gracia (5 días), perderán por completo el acceso al panel.

---

### 3. 👤 Miembro (El Usuario Final)
**Quiénes son:** Las personas, empleados o clientes que se unen a la red privada de una Compañía.
**Acceso:** Usan la interfaz pública o la app principal (el *Feed* principal `/`).

**Permisos:**
- ✅ **Perfil Público:** Crear y editar su propio perfil, foto, biografía y tarjeta de presentación digital (`/my-profile`).
- ✅ **Interacción (Feed):** Publicar posts de texto e imágenes en el feed de su comunidad (`/`). Dar *like* y comentar en las publicaciones de otros miembros (dentro de su misma red).
- ✅ **Consumo de Contenido:** Ver los eventos, leer los blogs y escuchar los podcasts creados por los Administradores de su Compañía.
- ✅ **Networking:** Buscar a colegas en la red, ver sus tarjetas públicas (`/card/:id`) y "conectar" para agregarlos a su lista de amigos (`/friends`).
- ❌ **Restricción:** No tienen acceso a ningún panel de administración.
- ❌ **Restricción:** No pueden crear eventos oficiales, subir episodios de podcast, ni modificar reglas de la plataforma. Solo consumen y publican contenido a nivel social.

---

## 🔄 Flujo de Trabajo Típico (Paso a Paso)

1. **Adquisición del Cliente:** Un nuevo cliente llega a la landing page de ConnectPro y compra un plan.
2. **Onboarding del Súper Admin:** El sistema (o un Súper Admin) crea la instancia de la "Compañía A" en la base de datos y activa su suscripción de Stripe.
3. **Configuración del Admin:** El cliente inicia sesión como Administrador. Configura su logo, añade un dominio web propio, y publica el primer "Evento de Bienvenida" en el panel de `/admin`.
4. **Invitación a Usuarios:** El Administrador envía el link de registro a sus seguidores o empleados.
5. **Uso Diario (Miembros):** Los miembros inician sesión, completan su perfil, asisten al evento, y escriben publicaciones de *networking* en el feed (el muro de estilo LinkedIn).
6. **Fin de Mes (Facturación):** Empieza el periodo de gracia; si el Administrador no paga la mensualidad, el Súper Admin bloquea el acceso total a la Compañía A (los miembros ya no ven el feed y el Admin pierde su panel) hasta que el pago se regularice.

---

## 🔒 Control de Privacidad y Seguridad
Cada petición a la base de datos incluye un filtro automático (Middleware en el Backend) que intercepta el Token (JWT) del usuario para verificar su `companyId` y su `role`. 
- Si un usuario trata de crear un evento, el Backend bloquea la petición diciendo "Solo los Administradores pueden hacer esto".
- Si el Admin de la Empresa A trata de buscar miembros de la Empresa B, la base de datos restringe la consulta porque el filtro estricto por `company_id` jamás se cruza. Lo que asegura total privacidad (Multi-tenant).
