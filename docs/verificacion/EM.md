# Parte A: la matriz y los tests que faltan

## A.1 · La matriz de trazabilidad 

Scenarios en el requisito: 3 · Cubiertos: 0

| Scenario 	| Test 	| Estado 	| Qué te faltó 	|   	|
|----------	|------	|--------	|--------------	|---	|
|Responsable identificable         	|      	|   No cubierto     	| No hay test             	|   	|
| La tarea no filtra datos de cuenta         	|      	|  No cubierto      	| No hay test             	|   	|
| Responsable sin nombre         	|      	| No cubierto       	| No hay test             	|   	|


## A.2 · Los tests que faltan

### Escenario: Responsable identificable 

 -Test: 'la tarea trae el nombre y las iniciales de su responsable'.

 
 ### Escenario: La tarea no filtra datos de cuenta 

 -Test: 'la tarea suelta no expone el email ni otros datos de la cuenta responsable',

 -Test: 'las tareas de la lista no exponen el email ni otros datos de la cuenta responsable'.
 
 (Se mantienen dos tests porque el escenario habla de tarea lista o tarea suelta)


### Escenario: Responsable sin nombre
- Test: la tarea de un responsable sin nombre trae el nombre nulo y sus iniciales

---

# Parte B: las tres líneas

## Cuántos scenarios creías cubiertos antes de mirar, y cuántos lo estaban
Cuántos scenarios creías cubiertos antes de mirar: 0

Cuántos lo estaban: 0

## El scenario en el que no supiste si faltaba un test o faltaba la regla en la spec.

- El escenario 3 no detallaba como se genera las inciales para los responsables  que tienen nombre null. Vi que hay un test de generación de iniciales y supuse que esa regla de generación de iniciales no corresopndia a este requerimeinto (aquí solo tenia que comprobar que las iniciales estaban informadas). 


## Algo que el scenario no determinaba y tuviste que decidir al escribir el test.

- El escenario 1, habla de "y esos datos bastan para saber quién la lleva". Dudé si se permitia el id o no.
- El escenario 2 hablaba de "ningún otro dato de acceso". No sabia que es otro dato de acceso. Mantuve propuesta de IA (contraseña, token, secret, y email que si detalla el escenario)
- El escenario 2 hablaba de tarea suelta o tarea de lista. Decidí mantener 2 tests para el mismo escenario, aunque creo que se deberían reformular los escenarios para diferenciar si se trata de comprobaciones a aplicar tras el transformer de lista o de tarea suelta. 







