import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { CalendarPage } from "../../src/calendar/pages/CalendarPage"
import { useAuthStore } from "../../src/hooks/useAuthStore"
import { AppRouter } from "../../src/router/AppRouter"

jest.mock('../../src/hooks/useAuthStore')

jest.mock('../../src/calendar/pages/CalendarPage', () => ({
  CalendarPage: () => <h1>CalendarPage</h1>
}))

describe('Pruebas en AppRouter', () => {

  const mockedCheckAuthToken = jest.fn()

  beforeEach(() => jest.clearAllMocks())

  test('Debe de mostrar la pantalla de cargar y llamar checkAuthToken', () => {

    useAuthStore.mockReturnValue({
      status: 'checking',
      checkAuthToken: mockedCheckAuthToken
    })

    render(<AppRouter />)
    expect(screen.getByText('Cargando...')).toBeTruthy()
    expect(mockedCheckAuthToken).toHaveBeenCalled()
  })

  test('Debe de mostrar el login en caso de no estar autenticado', () => {

    useAuthStore.mockReturnValue({
      status: 'not-authenticated',
      checkAuthToken: mockedCheckAuthToken
    })

    const { container } = render
      (
        <MemoryRouter>
          <AppRouter />
        </MemoryRouter>
      )

    expect(screen.getByText('Ingreso')).toBeTruthy()
    expect(container).toMatchSnapshot()
  })

  test('Debe de mostrar el calendario si estoy autenticado', () => {

    useAuthStore.mockReturnValue({
      status: 'authenticated',
      checkAuthToken: mockedCheckAuthToken
    })

    render(
      <MemoryRouter>
        <AppRouter />
      </MemoryRouter>
    )

    expect(screen.getByText('CalendarPage')).toBeTruthy()
  })
})