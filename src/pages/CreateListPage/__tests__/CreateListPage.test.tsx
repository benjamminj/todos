import React from 'react'
import { screen, render, fireEvent, waitFor } from '@testing-library/react'
import { CreateListPage } from '../CreateListPage'
import fetch from 'isomorphic-unfetch'
import Router from 'next/router'

jest.mock('isomorphic-unfetch', () => {
  return jest.fn(() =>
    Promise.resolve({
      status: 200,
      json: () =>
        Promise.resolve({
          id: 'TEST-FROM-API',
          name: 'Test from API',
          color: 'pink',
          itemIds: [],
        }),
    })
  )
})

jest.mock('next/router', () => {
  return {
    push: jest.fn(),
  }
})

describe('<CreateListPage />', () => {
  test('should render', () => {
    render(<CreateListPage />)
    expect(screen.getByText('Create a new list')).toBeInTheDocument()
  })

  test('should allow creating a new list', async () => {
    render(<CreateListPage />)

    const $nameInput = screen.getByLabelText('List Name') as HTMLInputElement

    fireEvent.change($nameInput, {
      target: { value: 'Test List!' },
    })
    fireEvent.blur($nameInput)

    const $colorSelect = screen.getByLabelText('Select a color')
    const $redOption = screen.getByText('Red') as HTMLOptionElement

    fireEvent.change($colorSelect, {
      target: { value: $redOption.value },
    })
    fireEvent.blur($colorSelect)

    fireEvent.click(screen.getByText('Create'))

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))
    expect(Router.push).toHaveBeenCalledWith(
      '/lists/[listId]',
      '/lists/TEST-FROM-API'
    )
  })
})
