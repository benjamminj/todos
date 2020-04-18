import React from 'react'
import { Layout } from '../Layout'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe('<Layout />', () => {
  test('should render', () => {
    const { getByText } = render(<Layout title="test" />)
    expect(getByText("I'm here to stay (Footer)")).toBeInTheDocument()
  })
})
