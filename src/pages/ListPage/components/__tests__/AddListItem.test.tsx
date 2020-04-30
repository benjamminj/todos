import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { AddListItem } from '../AddListItem'
import { CacheContextProvider } from 'rhdf'
import { ListService } from '../../../../modules/lists/list.service'

describe('<AddListItem />', () => {
  test('should allow you to add a list item', async () => {
    const id = 'b9y7rp6wt'

    const { getByLabelText, getByText } = render(
      <CacheContextProvider
        cache={
          new Map([
            [`/lists/${id}`, ListService.getListById(id, { expand: 'items' })],
          ])
        }
      >
        <AddListItem listId={id} />
      </CacheContextProvider>
    )

    fireEvent.change(getByLabelText('Add an item'), {
      target: { value: 'Susie' },
    })

    fireEvent.click(getByText('Add'))
  })
})
