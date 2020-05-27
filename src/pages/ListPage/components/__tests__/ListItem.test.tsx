import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { ListItem } from '../ListItem'
import { CacheContextProvider } from 'rhdf'
import { ListItem as ListItemInterface } from '../../../../modules/lists/types'
import { fetch } from '../../../../lib/fetch'

jest.mock('../../../../lib/fetch', () => {
  return {
    fetch: jest.fn().mockResolvedValue({
      json: async () => ({
        id: '123',
        listId: 'TEST-LIST-ID',
        status: 'todo',
        name: 'TEST FROM API',
      }),
    }),
  }
})

const listId = '1234'
const mockItem: ListItemInterface = {
  id: '123',
  listId,
  status: 'todo',
  name: 'Test',
  description: null,
}
const mockList = {
  id: '1234',
  name: 'mock list',
  colorScheme: 'red',
  itemIds: [mockItem.id],
  items: [mockItem],
}

describe('<ListItem />', () => {
  test('should render the list item', () => {
    const { getByText } = render(
      <ListItem name="Test" id="potato" listId="b9y7rp6wt" status="todo" />
    )
    expect(getByText('Test')).toBeInTheDocument()
  })

  test('should allow you to edit the item', async () => {
    const { getByText, getByLabelText, queryByLabelText } = render(
      <CacheContextProvider
        cache={new Map([[`/lists/${listId}/items`, mockList.items]])}
      >
        <ListItem {...mockItem} />
      </CacheContextProvider>
    )

    expect(queryByLabelText('Name')).toBeNull()
    fireEvent.click(getByText('Edit'))

    const $input = getByLabelText('Name') as HTMLInputElement
    expect($input).toBeInTheDocument()
    expect($input.value).toEqual('Test')

    fireEvent.change($input, { target: { value: 'Testz' } })

    expect($input.value).toEqual('Testz')

    fireEvent.blur($input)

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

    expect(fetch).toHaveBeenCalledTimes(1)
  })

  test('should submit the "edit" form when pressing ENTER', async () => {
    const { getByText, getByLabelText, queryByLabelText } = render(
      <CacheContextProvider
        cache={new Map([[`/lists/${listId}/items`, mockList.items]])}
      >
        <ListItem name="Test" id="0l28pul1z" listId="b9y7rp6wt" status="todo" />
      </CacheContextProvider>
    )

    expect(queryByLabelText('Name')).toBeNull()
    fireEvent.click(getByText('Edit'))

    const $input = getByLabelText('Name') as HTMLInputElement
    expect($input).toBeInTheDocument()
    expect($input.value).toEqual('Test')

    fireEvent.change($input, { target: { value: 'Testz' } })

    expect($input.value).toEqual('Testz')

    fireEvent.keyPress($input, { key: 'Enter' })

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
