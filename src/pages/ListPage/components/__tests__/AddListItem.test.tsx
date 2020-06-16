import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { AddListItem } from '../AddListItem'
import { queryCache, AnyQueryKey } from 'react-query'
import fetch from 'isomorphic-unfetch'

jest.mock('isomorphic-unfetch', () => {
  return jest.fn(() => {
    return Promise.resolve({
      json: () => ({
        id: 'pyq6efgzn',
        listId: 'b9y7rp6wt',
        name: 'Susie',
        status: 'todo',
        description: null,
      }),
    })
  })
})

describe('<AddListItem />', () => {
  beforeEach(() => {
    queryCache.clear()
  })

  test('should allow you to add a list item', async () => {
    jest.spyOn(queryCache, 'refetchQueries')
    const id = 'b9y7rp6wt'

    const { getByLabelText, getByText } = render(<AddListItem listId={id} />)

    fireEvent.change(getByLabelText('Add an item'), {
      target: { value: 'Susie' },
    })

    fireEvent.click(getByText('Add'))
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

    const cacheKey = ['listItems', id] as AnyQueryKey

    // Optimistic update
    expect(queryCache.getQueryData(cacheKey)).toEqual([
      {
        id: 'OPTIMISTIC_Susie',
        listId: 'b9y7rp6wt',
        name: 'Susie',
        status: 'todo',
      },
    ])

    // Actual update
    expect(queryCache.refetchQueries).toHaveBeenCalledWith(cacheKey)
  })
})
