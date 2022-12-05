import { configureStore } from "@reduxjs/toolkit"
import { act, renderHook } from "@testing-library/react"
import { Provider } from "react-redux"
import { useUiStore } from "../../src/hooks"
import { uiSlice } from '../../src/store'

const getMockedStore = (initialState) => {
  return configureStore({
    reducer: {
      ui: uiSlice.reducer
    },
    preloadedState: {
      ui: { ...initialState }
    }
  })
}

describe('Pruebas en useUiStore', () => {
  test('Debe de regresar los valores por defecto', () => {

    const mockedStore = getMockedStore({
      isDateModalOpen: false
    })

    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => <Provider store={mockedStore}>{children}</Provider>
    })

    expect(result.current).toEqual({
      isDateModalOpen: false,
      closeDateModal: expect.any(Function),
      openDateModal: expect.any(Function),
      toggleDateModal: expect.any(Function),
    })
  })

  test('openDateModal debe de colocar el true en isDateModalOpen', () => {
    const mockedStore = getMockedStore({
      isDateModalOpen: false
    })

    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => <Provider store={mockedStore}>{children}</Provider>
    })

    const { openDateModal } = result.current

    act(() => {
      openDateModal()
    });

    expect(result.current.isDateModalOpen).toBeTruthy()
  })

  test('closeDateModal debe de colocar false en isDateModalOpen', () => {
    const mockedStore = getMockedStore({
      isDateModalOpen: true
    })

    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => <Provider store={mockedStore}>{children}</Provider>
    })

    const { closeDateModal } = result.current

    act(() => {
      closeDateModal()
    });

    expect(result.current.isDateModalOpen).toBeFalsy()

  })

  test('toggleDateModal debe de cambiar el estado', () => {
    const mockedStore = getMockedStore({
      isDateModalOpen: true
    })

    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => <Provider store={mockedStore}>{children}</Provider>
    })

    act(() => {
      result.current.toggleDateModal()
    });
    expect(result.current.isDateModalOpen).toBeFalsy()

    act(() => {
      result.current.toggleDateModal()
    });
    expect(result.current.isDateModalOpen).toBeTruthy()
  })
})