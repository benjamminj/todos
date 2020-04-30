import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { ListItem } from '../ListItem'

describe('<ListItem />', () => {
  test('should render the list item', () => {
    const { getByText } = render(<ListItem name="Test" id="potato" />)
    expect(getByText('Test')).toBeInTheDocument()
  })

  test('should allow you to edit the item', () => {
    // TODO: mock list service
    jest.mock('../../../../modules/lists/list.service')
    const { getByText, getByLabelText, queryByLabelText } = render(
      <ListItem name="Test" id="0l28pul1z" />
    )

    expect(queryByLabelText('Name')).toBeNull()
    fireEvent.click(getByText('Edit'))

    const $input = getByLabelText('Name') as HTMLInputElement
    expect($input).toBeInTheDocument()
    expect($input.value).toEqual('Test')

    fireEvent.change($input, { target: { value: 'Testz' } })

    expect($input.value).toEqual('Testz')

    fireEvent.blur($input)
  })
})
