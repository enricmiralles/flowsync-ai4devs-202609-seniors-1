## Purpose

Esta capability permite a una persona crear una cuenta en FlowSync, iniciar sesión, mantener esa sesión activa entre visitas y consultar su propio perfil, como puerta de entrada al resto de la aplicación.

## Requirements

### Requirement: Registro de cuenta - [VERIFICADO]
El sistema SHALL permitir a un visitante crear una cuenta nueva proporcionando un email, una contraseña y la confirmación de esa contraseña; el nombre completo es opcional. El sistema SHALL rechazar el registro si el email ya pertenece a una cuenta existente, si la contraseña no coincide con su confirmación, o si la contraseña no tiene entre 8 y 32 caracteres. Al completarse con éxito, la persona SHALL quedar con una sesión ya iniciada, sin necesidad de iniciar sesión por separado a continuación.

#### Scenario: Registro con datos válidos
- **WHEN** un visitante envía un email no registrado previamente, una contraseña de entre 8 y 32 caracteres y una confirmación idéntica a esa contraseña
- **THEN** el sistema crea la cuenta, responde con los datos de la nueva persona usuaria y entrega una credencial de sesión ya válida

#### Scenario: Email ya registrado
- **WHEN** un visitante intenta registrarse con un email que ya pertenece a otra cuenta
- **THEN** el sistema rechaza la petición, señala que ese campo ya está en uso, y no crea la cuenta

#### Scenario: La confirmación de contraseña no coincide
- **WHEN** un visitante envía una contraseña y una confirmación de contraseña distintas entre sí
- **THEN** el sistema rechaza la petición señalando el campo de confirmación, y no crea la cuenta

#### Scenario: Contraseña fuera de la longitud permitida
- **WHEN** un visitante envía, al registrarse, una contraseña de menos de 8 o de más de 32 caracteres
- **THEN** el sistema rechaza la petición señalando el campo de contraseña, y no crea la cuenta

### Requirement: Inicio de sesión - [DUDA]
El sistema SHALL permitir a una persona con cuenta autenticarse mediante su email y su contraseña, entregando en caso de éxito una credencial de sesión y sus propios datos. Ante un email o una contraseña incorrectos, el sistema SHALL responder con un único mensaje que no distinga cuál de los dos datos fue el erróneo. El sistema SHALL evaluar la contraseña recibida como una credencial cualquiera, sin aplicar en el inicio de sesión las restricciones de formato exigidas al registrarse, de modo que no se revela qué política de contraseñas está vigente.

#### Scenario: Credenciales correctas
- **WHEN** una persona envía el email y la contraseña de una cuenta existente y correcta
- **THEN** el sistema responde con sus datos y una nueva credencial de sesión válida

#### Scenario: Credenciales incorrectas
- **WHEN** una persona envía un email que no corresponde a ninguna cuenta, o una contraseña incorrecta para un email que sí existe
- **THEN** el sistema rechaza el acceso con un mensaje genérico de credenciales incorrectas, sin indicar cuál de los dos datos falló

#### Scenario: Contraseña que no cumple la política de longitud del registro
- **WHEN** una persona intenta iniciar sesión con una contraseña de menos de 8 o de más de 32 caracteres
- **THEN** el sistema no la rechaza por su formato, sino que la evalúa igual que cualquier otra contraseña frente a las credenciales guardadas, sin revelar en ningún momento la política de longitud aplicada al registro

### Requirement: Consulta del perfil propio - [VALIDADO]
El sistema SHALL permitir a una persona con sesión iniciada consultar sus propios datos: nombre completo (o la ausencia de uno), email, iniciales y fecha de alta. El sistema SHALL rechazar esta consulta cuando no se presente una sesión válida.

#### Scenario: Consulta con sesión válida
- **WHEN** una persona con sesión iniciada solicita su perfil
- **THEN** el sistema responde con su nombre (o la indicación de que no tiene), su email, sus iniciales y su fecha de alta

#### Scenario: Consulta sin sesión válida
- **WHEN** alguien solicita el perfil sin presentar una sesión válida
- **THEN** el sistema rechaza la petición sin devolver ningún dato

### Requirement: Cierre de sesión - [VALIDADO]
El sistema SHALL permitir a una persona con sesión iniciada cerrarla. Ese cierre SHALL invalidar únicamente la credencial usada en esa petición; el sistema MUST NOT invalidar otras sesiones que la misma cuenta tenga abiertas en otros dispositivos u orígenes.

#### Scenario: Cierre de la sesión actual
- **WHEN** una persona con sesión iniciada solicita cerrarla
- **THEN** el sistema invalida esa credencial y confirma el cierre; una petición posterior con esa misma credencial vuelve a ser rechazada

### Requirement: La sesión no caduca por el paso del tiempo - [DUDA]
El sistema SHALL mantener una credencial de sesión válida indefinidamente hasta que se cierre sesión de forma explícita; no exige renovarla ni la invalida por el mero paso del tiempo.

#### Scenario: Uso de una credencial emitida hace tiempo
- **WHEN** se presenta una credencial de sesión que sigue sin haberse cerrado, por antigua que sea
- **THEN** el sistema la sigue aceptando como válida

### Requirement: Validación de los datos de entrada
El sistema SHALL validar la presencia y el formato de los campos enviados al registrarse o al iniciar sesión, y SHALL rechazar la petición señalando qué campo incumple la regla cuando la validación falla.

#### Scenario: Falta un campo obligatorio
- **WHEN** una persona envía una petición de registro o de inicio de sesión sin el email o sin la contraseña
- **THEN** el sistema rechaza la petición señalando el campo que falta

#### Scenario: El email no tiene formato de email
- **WHEN** una persona envía, en el campo de email, un valor que no tiene forma de dirección de correo
- **THEN** el sistema rechaza la petición señalando ese campo

### Requirement: Pantalla de inicio de sesión
El sistema SHALL mostrar, a quien no tiene sesión iniciada, una pantalla con un formulario de email y contraseña. Cuando el sistema rechace el intento, SHALL mostrar el error asociado al campo correspondiente si el problema es de un campo visible en el formulario, o un aviso general si no lo es. En caso de éxito, SHALL llevar a la persona a la pantalla de su perfil.

#### Scenario: Inicio de sesión correcto
- **WHEN** una persona sin sesión rellena el email y la contraseña de una cuenta válida y confirma el formulario
- **THEN** la aplicación la lleva a la pantalla de su perfil

#### Scenario: Error de credenciales en pantalla
- **WHEN** el sistema rechaza el intento de inicio de sesión por credenciales incorrectas
- **THEN** la pantalla muestra un aviso general indicando que el email o la contraseña no son correctos

### Requirement: Pantalla de registro
El sistema SHALL mostrar, a quien no tiene sesión iniciada, una pantalla con un formulario de nombre completo (opcional), email, contraseña y confirmación de contraseña. Antes de enviar los datos al servidor, el sistema SHALL comprobar en la propia pantalla que la contraseña y su confirmación coinciden. En caso de éxito, la persona SHALL quedar con sesión iniciada y SHALL ser llevada a la pantalla de su perfil.

#### Scenario: Contraseñas distintas detectadas en la propia pantalla
- **WHEN** una persona escribe una contraseña y una confirmación de contraseña distintas y confirma el formulario
- **THEN** la pantalla señala el error sobre el campo de confirmación sin llegar a contactar con el servidor

#### Scenario: Registro correcto
- **WHEN** una persona rellena el formulario de registro con datos válidos y lo confirma
- **THEN** queda con sesión iniciada y es llevada a la pantalla de su perfil

### Requirement: Pantalla de perfil
El sistema SHALL mostrar, a quien tiene sesión iniciada, su nombre completo (o una indicación de que no lo tiene registrado), su email, sus iniciales y la fecha en la que se dio de alta. Esta pantalla SHALL ofrecer una acción para cerrar sesión.

#### Scenario: Visualización del perfil propio
- **WHEN** una persona con sesión iniciada abre la pantalla de perfil
- **THEN** ve su nombre (o la indicación de que no tiene), su email, sus iniciales y su fecha de alta

#### Scenario: Cierre de sesión desde el perfil
- **WHEN** una persona con sesión iniciada acciona "cerrar sesión" desde su perfil
- **THEN** el sistema cierra su sesión y la lleva a la pantalla de inicio de sesión

### Requirement: Protección de pantallas según el estado de sesión
El sistema SHALL impedir que una persona sin sesión iniciada acceda a la pantalla de perfil, enviándola a la de inicio de sesión. El sistema SHALL impedir que una persona con sesión iniciada acceda a las pantallas de inicio de sesión o de registro, enviándola a la de perfil.

#### Scenario: Visitante sin sesión intenta ver el perfil
- **WHEN** alguien sin sesión iniciada navega directamente a la pantalla de perfil
- **THEN** el sistema la envía a la pantalla de inicio de sesión

#### Scenario: Persona con sesión intenta volver a iniciar sesión o registrarse
- **WHEN** alguien con sesión iniciada navega a la pantalla de inicio de sesión o a la de registro
- **THEN** el sistema la envía a la pantalla de su perfil

### Requirement: Recuperación de la sesión al recargar la aplicación
Al abrir la aplicación con una sesión guardada de una visita anterior, el sistema SHALL mostrar un estado de carga mientras confirma que esa sesión sigue siendo válida. Si se confirma que ya no lo es, el sistema SHALL cerrarla y SHALL explicar en la pantalla de inicio de sesión que la sesión ha caducado. Si la confirmación falla por un motivo ajeno a la validez de la sesión, el sistema SHALL conservar la sesión guardada para reintentarlo más adelante, informando de que no se ha podido restaurar en ese momento.

#### Scenario: La sesión guardada ya no es válida
- **WHEN** se recarga la aplicación con una sesión guardada y se confirma que esa credencial ya no es válida
- **THEN** el sistema cierra la sesión y muestra en el inicio de sesión un aviso de que la sesión ha caducado

#### Scenario: Problema ajeno a la sesión al restaurarla
- **WHEN** se recarga la aplicación con una sesión guardada y no se puede confirmar su validez por un problema distinto de que la sesión sea inválida
- **THEN** el sistema conserva la sesión guardada y muestra un aviso de que no se ha podido restaurar en ese momento, sin cerrarla de forma definitiva

---

## Parte B: las tres listas

### 1. Recuento

- Requisitos escritos por el agente: **11**
- Requisitos comprobados abriendo el código (no solo leídos y dados por razonables): **5**

### 2. Incoherencias detectadas al escribir la spec

- En la pantalla de registro, el campo de contraseña declara visualmente una longitud mínima de 8 caracteres, pero el formulario tiene desactivada la validación nativa del navegador; esa declaración no llega a bloquear el envío por sí sola y toda la validación real ocurre contra el servidor, igual que en el resto de campos. — Autogenerado por Claude
- La consulta del perfil devuelve los datos de la persona usuaria "sueltos", mientras que el registro y el inicio de sesión devuelven esos mismos datos envueltos junto con la credencial de sesión: la forma de la respuesta no es igual en los tres casos aunque los tres compartan los mismos datos de usuario. — Autogenerado por Claude

### 3. Casos "¿bug o contrato?"

- Validación de longitud de la contraseña al iniciar sesion. Podria ser intencionado para no revelar requisitos de seguridad. Se añade como escenario. Le pedí que quitara la duda, pero realmente lo es. No se es es intencionado o no.
  
- Las credenciales de sesión no caducan nunca por el paso del tiempo: posible bug de seguridad, porque una credencial filtrada o robada seguiría siendo válida indefinidamente sin ningún mecanismo de expiración que la neutralice; o podría ser una decisión consciente de simplicidad para esta fase del proyecto. No hay forma de decidirlo solo leyendo el código. — Autogenerado por Claude
  
- Cerrar sesión invalida únicamente el dispositivo o cliente desde el que se pide, dejando intactas las sesiones abiertas en otros dispositivos: podría ser soporte intencional para varias sesiones simultáneas, o podría esperarse que "cerrar sesión" cierre todas las sesiones de la cuenta. — Autogenerado por Claude

- Cuando falla la confirmación de una sesión guardada por un motivo distinto de que sea inválida, el sistema conserva la credencial guardada pero, mientras tanto, trata a la persona como si no tuviera sesión: podría ser una degradación pensada para reintentar sin fricción cuando vuelva la conexión, o un estado intermedio confuso que nadie llegó a decidir a propósito. — Autogenerado por Claude

- Al cerrar sesión, la aplicación da la sesión por cerrada de inmediato en el dispositivo actual y, si la llamada al servidor para invalidar la credencial falla, ese fallo se descarta en silencio: posible bug, porque la credencial podría seguir siendo válida en el servidor sin que la persona lo sepa ni tenga forma de notarlo; o podría ser una decisión consciente de priorizar que el cierre de sesión nunca se perciba como fallido desde fuera. — Autogenerado por Claude
