import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { AddListItem } from '../AddListItem'
import { CacheContextProvider } from 'rhdf'

jest.mock('isomorphic-unfetch', () => {
  return () => {
    return Promise.resolve({
      json: () => ({
        id: 'pyq6efgzn',
        listId: 'b9y7rp6wt',
        name: 'Susie',
        status: 'todo',
        description: null,
      }),
    })
  }
})

describe('<AddListItem />', () => {
  test('should allow you to add a list item', async () => {
    const id = 'b9y7rp6wt'

    const { getByLabelText, getByText } = render(
      <CacheContextProvider>
        <AddListItem listId={id} />
      </CacheContextProvider>
    )

    fireEvent.change(getByLabelText('Add an item'), {
      target: { value: 'Susie' },
    })

    fireEvent.click(getByText('Add'))
  })
})
