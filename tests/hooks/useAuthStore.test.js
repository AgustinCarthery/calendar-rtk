import { configureStore } from "@reduxjs/toolkit"
import { act, renderHook, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import { calendarApi } from "../../src/api"
import { useAuthStore } from "../../src/hooks/useAuthStore"
import { authSlice } from "../../src/store"
import { initialState, notAuthenticatedState } from '../fixtures/authStates'
import { testUserCredentials } from "../fixtures/testUser"

const getMockedStore = (initialState) => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer
    },
    preloadedState: {
      auth: { ...initialState }
    }
  })
}

describe('Pruebas en useAuthStore', () => {
  beforeEach(() => localStorage.clear()
  )
  test('Debe de retornar los valores por defectos', () => {

    const mockedStore = getMockedStore({ ...initialState })

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockedStore}>{children}</Provider>
    })

    expect(result.current).toEqual({
      status: 'checking',
      user: {},
      errorMessage: undefined,
      startLogin: expect.any(Function),
      startRegister: expect.any(Function),
      checkAuthToken: expect.any(Function),
      startLogout: expect.any(Function),
    })

  })

  test('startLogin debe de realizar el login correctamente', async () => {

    const mockedStore = getMockedStore({ ...notAuthenticatedState })

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockedStore}>{children}</Provider>
    })

    await act(async () => {
      await result.current.startLogin(testUserCredentials)
    })

    const { errorMessage, status, user } = result.current

    expect({ errorMessage, status, user }).toEqual({
      errorMessage: undefined,
      status: 'authenticated',
      user: { name: 'Test user', uid: '638ce7a3909ad7287ec9707e' }
    })

    expect(localStorage.getItem('token')).toEqual(expect.any(String))
    expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String))
  })

  test('startLogin debe de fallar la autenticacion', async () => {

    const mockedStore = getMockedStore({ ...notAuthenticatedState })

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockedStore}>{children}</Provider>
    })

    await act(async () => {
      await result.current.startLogin({ email: 'random@google.com', password: '12345678' })
    })

    const { errorMessage, status, user } = result.current

    expect(localStorage.getItem('token')).toBeNull()
    expect({ errorMessage, status, user }).toEqual({
      status: 'not-authenticated',
      user: {},
      errorMessage: expect.any(String),
    })

    waitFor(
      () => expect(result.current.errorMessage).toBeUndefined()
    )
  })

  test('startRegister debe de crear un usuario', async () => {

    const newUser = { email: 'random2@google.com', password: '12345678', name: 'Test User2' }
    const mockedStore = getMockedStore({ ...notAuthenticatedState })

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockedStore}>{children}</Provider>
    })

    const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
      data: {
        ok: true,
        uid: '1234567890',
        name: 'Test User',
        token: 'Test-Token'
      }
    })

    await act(async () => {
      await result.current.startRegister(newUser)
    })

    const { errorMessage, status, user } = result.current

    expect({ errorMessage, status, user }).toEqual({
      errorMessage: undefined,
      status: 'authenticated',
      user: { name: 'Test User', uid: '1234567890' }
    });

    spy.mockRestore();

  })

  test('startRegister debe de fallar la creacion', async () => {

    const mockedStore = getMockedStore({ ...notAuthenticatedState })

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockedStore}>{children}</Provider>
    })

    await act(async () => {
      await result.current.startRegister(testUserCredentials)
    })

    const { errorMessage, status, user } = result.current

    expect({ errorMessage, status, user }).toEqual({
      errorMessage: 'User already exists',
      status: 'not-authenticated',
      user: {}
    });

  })

  test('checkAuthToken debe fallar si no hay un token', async () => {
    const mockedStore = getMockedStore({ ...initialState })

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockedStore}>{children}</Provider>
    })

    await act(async () => {
      await result.current.checkAuthToken()
    })

    const { errorMessage, status, user } = result.current

    expect({ errorMessage, status, user }).toEqual({
      errorMessage: undefined,
      status: 'not-authenticated',
      user: {}
    })
  })

  test('checkAuthToken debe de autenticar el usuario si hay un token', async () => {

    const { data } = await calendarApi.post('/auth', testUserCredentials)
    localStorage.setItem('token', data.token)

    const mockedStore = getMockedStore({ ...initialState })

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockedStore}>{children}</Provider>
    })

    await act(async () => {
      await result.current.checkAuthToken()
    })

    const { errorMessage, status, user } = result.current

    expect({ errorMessage, status, user }).toEqual({
      errorMessage: undefined,
      status: 'authenticated',
      user: { name: 'Test user', uid: expect.any(String) }
    })
  })

})