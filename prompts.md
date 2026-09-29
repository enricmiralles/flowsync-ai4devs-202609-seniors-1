# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

## Cómo rellenarlo

- Un apartado `## Prompt N` por cada prompt.
- **Pega el prompt tal cual lo lanzaste**, dentro del bloque de código, aunque ocupe diez líneas
  y aunque tenga faltas. No lo reescribas para que quede bien: el que arreglaste mentalmente
  después no es el que lanzaste.
- Incluye también los que **no funcionaron**. Suelen ser los más útiles de leer.
- `Modelo` y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

---

## Prompt 1

**Modelo:** Sonnet 5 (high)
**Herramienta:** Claude Code

```
Analiza el repositorio actual, necesito documentar la spec de la épica de cuentas de usuario y acceso (solo esta parte, no incluyas nada de E2- gestión de tareas ni de E3-actividad-equipo).
La especificación debe ser completa, incluyendo el frontal y backend, pero en lenguaje de negocio (sin incluir detalles de codigo o la implementación). 
En el backend documenta peticiones y respuestas En el frontal documenta pantallas existentes.

El formato será un archivo con 3 secciones.

- Arriba, un ## Purpose de una o dos frases: para qué existe esta capability.
- Debajo, ## Requirements, y colgando de él los  ### Requirement: en los que el sistema SHALL hacer algo.
- Bajo cada requisito, al menos un #### Scenario: de cuatro almohadillas, con dos viñetas: **WHEN** y **THEN**. No hay casilla para el GIVEN: la precondición se mete dentro del WHEN.

Prepara la especificación en castellano, salvo las palabras reservadas de la RFC-2119 (MUST/SHALL, MAY , SHOULD, MUST NOT).
```

**Qué salió:** el agente exploró backend y frontend en paralelo (dos subagentes) y encontró que el propio `README.md` del proyecto ya fija el formato exacto de este ejercicio (ubicación `docs/spec-viva/<iniciales>.md`, reglas duras, Parte B obligatoria) — algo que este prompt no mencionaba. En vez de asumir, preguntó el alcance antes de escribir nada.

---

## Prompt 2

**Modelo:** Sonnet 5 (high)
**Herramienta:** Claude Code

```
Añade la parte B, y usa la ruta docs/spec-viva/EM.md
```

**Qué salió:** confirmó alcance completo (spec + las tres listas) y la ruta del archivo; con eso cerró el plan.

---

## Prompt 3

**Modelo:** Sonnet 5 (high)
**Herramienta:** Claude Code

```
Ya he pasado a Auto Mode.
Aplica los cambios, pero no realices ningún commit ni PR todavía
```

**Qué salió:** salió de plan mode, releyó directamente el código clave (rutas, controladores, validadores, transformer, modelo, config de auth, páginas y contexto de sesión del frontend) para verificar cada requisito antes de darlo por bueno, y escribió `docs/spec-viva/EM.md` completo: 11 requisitos con sus escenarios y la Parte B con las tres listas. No hizo commit ni PR, tal como se pidió.

---

## Prompt 4

**Modelo:** Sonnet 5 (high)
**Herramienta:** Claude Code

```
Muestrame donde está el código y los detalles para verificar el requerimiento "Registro de cuenta"
```

**Qué salió:** funcionó a la primera; mostró ruta, controlador, validador y transformer con cita de archivo:línea para cada escenario del requisito.

---

## Prompt 5

**Modelo:** Sonnet 5 (high)
**Herramienta:** Claude Code

```
marca el titulo del requirement con un - [VERIFICADO] al final del texto, y pasa a mostrarme los detalles del requerimiento "Inicio de sesión"
```

**Qué salió:** funcionó a la primera; marcó el requisito y mostró el siguiente.

---

## Prompt 6

**Modelo:** Sonnet 5 (high)
**Herramienta:** Claude Code

```
El hecho que durante el login no se valide la longitud de la contraseña puede ser intencionado, para no revelar detalles de requisitos de seguridad aplicados. Quitalo del apartado B de dudas y añadelo como escenario adicinal al requisito actual.
```

**Qué salió:** corrección sobre una incoherencia que el agente había anotado como tal en la Parte B; se movió a un escenario del propio requisito de login en vez de quedar como incoherencia.

---

## Prompt 7

**Modelo:** Sonnet 5 (high)
**Herramienta:** Claude Code

```
Marca el equisito como [VALIDADO], y muestrame los detalles del siguiente requisito.
```

**Qué salió:** funcionó a la primera.

---

## Prompt 8

**Modelo:** Sonnet 5 (high)
**Herramienta:** Claude Code

```
Si, márcalo como válido, y pasa al siguiente requisito
```

**Qué salió:** funcionó; nótese la inconsistencia propia al pedir la marca ("VERIFICADO", luego "VALIDADO", luego "válido" a secas) — se resolvió reutilizando la última etiqueta explícita dada.

---

## Prompt 9

**Modelo:** Sonnet 5 (high)
**Herramienta:** Claude Code

```
Anota como posible Bug en la parte B. Marca ccomo validado y pasa al siguiente requerimiento
```

**Qué salió:** funcionó a la primera pese a la falta de tipeo ("ccomo"); añadió el matiz del cierre de sesión "optimista" (se da por cerrada en cliente aunque el servidor falle) como caso bug-o-contrato.

---

## Prompt 10

**Modelo:** Sonnet 5 (high)
**Herramienta:** Claude Code

```
Marca la expiración sin caducidad como posible BUG.
Marca el requerimiento como [DUDA], y pasa al siguiente requerimiento
```

**Qué salió:** funcionó a la primera; reformuló la entrada de la Parte B para inclinarla hacia "posible bug" en vez de dejarla neutra, y usó por primera vez la etiqueta `[DUDA]` en vez de `[VALIDADO]`.

---

## Prompt 11

**Modelo:** Sonnet 5 (high)
**Herramienta:** Claude Code

```
No, ya no tengo tiempo de revisar más. Genera el documento de prompts.md en base a esta sesion
```

**Qué salió:** genera este mismo archivo. La revisión quedó a medias: de los 11 requisitos escritos, solo 5 llegaron a marcarse en esta sesión de repaso guiado (`Registro de cuenta` y `Consulta del perfil propio` y `Cierre de sesión` como `[VALIDADO]`/`[VERIFICADO]`, `Inicio de sesión` como `[VALIDADO]`, y `La sesión no caduca por el paso del tiempo` como `[DUDA]`); los otros 6 (`Validación de los datos de entrada` y los 4 requisitos de frontend) quedaron sin marca explícita del usuario, aunque sí habían sido verificados contra el código al escribir la spec en el Prompt 3.
