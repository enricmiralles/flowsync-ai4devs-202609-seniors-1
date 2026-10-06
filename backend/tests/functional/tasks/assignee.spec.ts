import Task from '#models/task'
import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre los tres scenarios del
 * requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md` —responsable identificable, la tarea no filtra
 * datos de cuenta y responsable sin nombre.
 *
 * Quien consulta es siempre otra cuenta distinta de la responsable: si el
 * `assignee` saliera de la sesión y no de la tarea, con una sola cuenta el test
 * pasaría igual.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  async function sesion(client: any) {
    await User.create({
      fullName: 'Alan Turing',
      email: 'alan@example.com',
      password: 'secreto123',
    })

    const response = await client
      .post('/api/v1/auth/login')
      .json({ email: 'alan@example.com', password: 'secreto123' })

    return response.body().data.token as string
  }

  async function tareaDe(fullName: string | null, email: string, title: string) {
    const responsable = await User.create({ fullName, email, password: 'secreto123' })
    const tarea = await Task.create({ title, status: 'pending', assigneeId: responsable.id })

    return { responsable, tarea }
  }

  test('la tarea trae el nombre y las iniciales de su responsable', async ({ client, assert }) => {
    const token = await sesion(client)
    const { tarea } = await tareaDe('Ada Lovelace', 'ada@example.com', 'Revisar el informe')

    const response = await client
      .get(`/api/v1/tasks/${tarea.id}`)
      .qs({ today: '2026-10-06' })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const { assignee } = response.body().data
    assert.equal(assignee.fullName, 'Ada Lovelace')
    assert.equal(assignee.initials, 'AL')
  })

  /**
   * Lo que se comprueba es la lista blanca exacta —nombre e iniciales, ni
   * siquiera el `id`— y no solo la ausencia del email: si se cuela `id`,
   * `createdAt` o cualquier otro campo de la cuenta, el scenario («ningún otro
   * dato») ya no se cumple, y el test tiene que caer.
   * Además se busca en el JSON entero de la tarea el email, la contraseña y el
   * token de la sesión, por si alguno llegara fuera del `assignee`.
   */
  function assertSinDatosDeCuenta(assert: any, tarea: any, token: string) {
    assert.sameMembers(Object.keys(tarea.assignee), ['fullName', 'initials'])

    const serialized = JSON.stringify(tarea)
    assert.notInclude(serialized, 'ada@example.com')
    assert.notInclude(serialized, 'secreto123')
    assert.notInclude(serialized, 'password')
    assert.notInclude(serialized, token)
  }

  test('la tarea suelta no expone el email ni otros datos de la cuenta responsable', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const { tarea } = await tareaDe('Ada Lovelace', 'ada@example.com', 'Revisar el informe')

    const response = await client
      .get(`/api/v1/tasks/${tarea.id}`)
      .qs({ today: '2026-10-06' })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assertSinDatosDeCuenta(assert, response.body().data, token)
  })

  test('las tareas de la lista no exponen el email ni otros datos de la cuenta responsable', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const { tarea } = await tareaDe('Ada Lovelace', 'ada@example.com', 'Revisar el informe')

    const response = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const tareas = response.body().data as Array<{ id: number }>
    const deAda = tareas.find((t) => t.id === tarea.id)

    assert.exists(deAda)
    assertSinDatosDeCuenta(assert, deAda, token)
  })

  /**
   * El nombre tiene que llegar nulo —no ausente, ni vacío, ni sustituido por
   * nada—, y las iniciales tienen que llegar igual. Cómo se calculan sin nombre
   * es cosa del requisito «Iniciales de la cuenta» de `auth` y ya lo cubre
   * `initials.spec.ts`; aquí basta con que sean las de la cuenta y no estén
   * vacías, que es lo que la interfaz necesita para pintarlo.
   */
  test('la tarea de un responsable sin nombre trae el nombre nulo y sus iniciales', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const { responsable, tarea } = await tareaDe(
      null,
      'sin-nombre@example.com',
      'Revisar el informe'
    )

    const response = await client
      .get(`/api/v1/tasks/${tarea.id}`)
      .qs({ today: '2026-10-06' })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const { assignee } = response.body().data
    assert.property(assignee, 'fullName')
    assert.isNull(assignee.fullName)

    assert.isString(assignee.initials)
    assert.isNotEmpty(assignee.initials)
    assert.equal(assignee.initials, responsable.initials)
  })
})
