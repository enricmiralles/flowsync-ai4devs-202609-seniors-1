# Prompts


## Prompt 1

**Modelo:** Opus 5.5 High
**Herramienta:** Claude Code

```
1- Lee los scenarios de la spec de tareas (openspec/specs/tasks/spec.md)
2- Considera solo el Requirement "Lo que cada tarea muestra de su responsable" y sus escenarios.
3- Analiza los tests del código (no solo su nombre, mira el contenido y analiza realmente lo que valida cada test)

4- Genera una tabla de trazabilidad: Cada scenario en una fila, que test lo cubre (si los hay, sino déjalo en blanco), y indica si el scenario queda completamente cubierto o no con ese test.

5- Mira también si hay otros tests que afecten a ese requirement y estén validando scanarios no reflejados en la spec. No los incluyas en la tabla, pero numéralos al final.

No cambies nada.
```

**Qué salió:** Matriz con scenarios sin tests. Hallazgo: el scenario 2 hoy no se cumple.



## Prompt 2

**Modelo:** Opus 5.5 High
**Herramienta:** Claude Code

```
Siguiendo el mismo estilo y patrones que los tests existentes, genera un nuevo test para el scenario 1 (Responsable identificable).
Genera el test en la carpeta backend/tests
Al finalizar muestrame el codigo generado y explicalo.

```

**Qué salió:** Genreró el test, hizo commit directo y abrió PR




## Prompt 3


**Modelo:** Opus 5.5 High
**Herramienta:** Claude Code


```
Deshaz el PR generado y el commit.
No hagas commit ni des por finalizada la tarea hasta que yo te lo indique.
```


**Qué salió:** Marco PR cerrado.


## Prompt 4


**Modelo:** Opus 5.5 High
**Herramienta:** Claude Code


```
genera el test para el scenario "La tarea no filtra datos de cuenta", y despues muestralo.

```


**Qué salió:** Genera test, Indica que este test falla, y ofrece  corregir código.



## Prompt 5


**Modelo:** Opus 5.5 High
**Herramienta:** Claude Code


```
Genera test para el scenario "Responsable sin nombre"

```


**Qué salió:** Genera test.


## Prompt 6


**Modelo:** Opus 5.5 High
**Herramienta:** Claude Code


```
Vuleve a generar la matriz de trazabilidad

```


**Qué salió:** Indica tests generados, vinculados a scenarios. Avisa de varias suposiciones en los tests nuevos no cubiertas en los scenarios.

```
De los tests nuevos, comprobaciones que van más allá del texto de la spec:

5. :41 comprueba que assignee.id coincide con el de la cuenta responsable. La spec no habla del id.
6. :107 y :123 aceptan id dentro del assignee. La spec dice «nombre e iniciales» y «ningún otro dato», así que no está claro si el id está permitido. Lo he aceptado porque TaskAssigneeTransformer lo expone a propósito.
7. :107 y :123 también comprueban que el token de quien consulta no aparece en la respuesta. La spec habla de los datos de la cuenta responsable, no de los de quien consulta.

```


## Prompt 7


**Modelo:** Opus 5.5 High
**Herramienta:** Claude Code


```
Para cada escenario solo quiero un único test. 
Has generado dos tests para el scenario "Responsable identificable". "la tarea suelta trae el nombre y las iniciales de su responsable" (:41); y "en la  lista  cada tarea trae a su propio responsable" (:65). 

Además estas validando que el assignee.id coincide con el de la cuenta responsable. No valides id, solo que trae el nombre y sus iniciales. Ningun otro dato.

No modifiques todavía los test de los otros escenarios

```


**Qué salió:** Dejó un único test.


## Prompt 8


**Modelo:** Opus 5.5 High
**Herramienta:** Claude Code


```
El escenario 3 no habla de tarea de lista y tarea suelta. Deja un único test

```


**Qué salió:** Dejó un único test.

