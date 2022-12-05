import calendarApi from "../../src/api/calendarApi"

describe('Pruebas en calendarApi', () => {

  test('Debe de tener la config por defecto', () => {
    expect(calendarApi.defaults.baseURL).toBe(process.env.VITE_API_URL)
  })

  test('Debe de tener el x-token en el header de las peticiones', async () => {

    const token = 'ABC-123-XYZ'
    localStorage.setItem('token', token);

    const resp = await calendarApi.get('/auth');

    expect(resp.config.headers['x-token']).toBe(token)
  })
})