const { render, screen, fireEvent } = require("@testing-library/react")
const { FabDelete } = require("../../../src/calendar/components/FabDelete")
const { useCalendarStore } = require("../../../src/hooks/useCalendarStore")


jest.mock('../../../src/hooks/useCalendarStore')

describe('Pruebas en FabDelete', () => {

  const mockedstartDeletingEvent = jest.fn()

  beforeEach(() => jest.clearAllMocks())

  test('Debe de mostrar el componente correctamente', () => {

    useCalendarStore.mockReturnValue({
      hasEventSelected: false
    })

    render(<FabDelete />)

    const btn = screen.getByLabelText('btn-delete')
    expect(btn.classList).toContain('btn')
    expect(btn.classList).toContain('btn-danger')
    expect(btn.classList).toContain('fab-danger')
    expect(btn.style.display).toBe('none')

  })

  test('Debe de mostrar el boton si hay un evento activo', () => {

    useCalendarStore.mockReturnValue({
      hasEventSelected: true
    })

    render(<FabDelete />)

    const btn = screen.getByLabelText('btn-delete')
    expect(btn.style.display).toBe('')

  })

  test('Debe llamar startDeletingEvent si hay evento activo', () => {

    useCalendarStore.mockReturnValue({
      hasEventSelected: true,
      startDeletingEvent: mockedstartDeletingEvent
    })

    render(<FabDelete />)

    const btn = screen.getByLabelText('btn-delete')
    fireEvent.click(btn)
    expect(mockedstartDeletingEvent).toHaveBeenCalled()

  })
})