import Task from '#models/task'
import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre el scenario «Responsable
 * identificable» del requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`, tanto en la tarea suelta como dentro de la
 * lista.
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

  async function tareaDe(fullName: string, email: string, title: string) {
    const responsable = await User.create({ fullName, email, password: 'secreto123' })
    const tarea = await Task.create({ title, status: 'pending', assigneeId: responsable.id })

    return { responsable, tarea }
  }

  test('la tarea suelta trae el nombre y las iniciales de su responsable', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const { responsable, tarea } = await tareaDe(
      'Ada Lovelace',
      'ada@example.com',
      'Revisar el informe'
    )

    const response = await client
      .get(`/api/v1/tasks/${tarea.id}`)
      .qs({ today: '2026-10-06' })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const { assignee } = response.body().data
    assert.equal(assignee.id, responsable.id)
    assert.equal(assignee.fullName, 'Ada Lovelace')
    assert.equal(assignee.initials, 'AL')
  })

  test('en la lista cada tarea trae a su propio responsable', async ({ client, assert }) => {
    const token = await sesion(client)
    const ada = await tareaDe('Ada Lovelace', 'ada@example.com', 'Revisar el informe')
    const grace = await tareaDe('Grace Hopper', 'grace@example.com', 'Preparar la demo')

    const response = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    // Se busca cada tarea por su id y no por su posición: lo que se comprueba
    // aquí es el responsable, no el orden de la lista.
    const tareas = response.body().data as Array<{ id: number; assignee: any }>
    const deAda = tareas.find((t) => t.id === ada.tarea.id)
    const deGrace = tareas.find((t) => t.id === grace.tarea.id)

    assert.exists(deAda)
    assert.exists(deGrace)

    assert.equal(deAda!.assignee.fullName, 'Ada Lovelace')
    assert.equal(deAda!.assignee.initials, 'AL')

    assert.equal(deGrace!.assignee.fullName, 'Grace Hopper')
    assert.equal(deGrace!.assignee.initials, 'GH')
  })
})
