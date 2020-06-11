import { List } from '../../src/modules/lists/types'

describe('E2E', () => {
  beforeEach(() => {
    cy.server()
    cy.task('clearDatabase')
    cy.viewport('iphone-x')
  })

  it('should be able to view a list', () => {
    cy.visit('/')

    cy.request('/api/lists').then((response) => {
      cy.wrap(
        response.body
          .map((list: List) => ({
            ...list,
            count: list.itemIds.length,
          }))
          .filter((list: List & { count: number }) => list.count > 0)
      ).as('lists')
    })

    cy.get('@lists').each(
      ({ name, count, id }: { name: string; count: number; id: string }) => {
        cy.findByTestId(`ListGroupCard__${id}`).findByText(`${count}`)
        cy.findByTestId(`ListGroupCard__${id}`).findByText(name).click()
        cy.findAllByTestId(`ListItem`, { exact: false }).should(
          'have.length',
          count
        )
        cy.findByText('Back').click({ force: true })
      }
    )
  })

  it('should be able to add a list', () => {
    cy.visit('/')
    cy.findByText('Create a new list').click()

    cy.findByText('Back').should('exist')
    cy.findByLabelText('List Name').type('Test Addition')
    cy.findByLabelText('Select a color').select('Purple')
    cy.findByText('Create').click()

    cy.findByText('No items yet.', { exact: false }).should('be.visible')
    cy.findByText('Test Addition').should('be.visible')

    cy.wrap(['First', 'Second', 'Third']).each((item: string) => {
      cy.findByLabelText('Add an item').type(item)

      // Hidden element, this is the "+" icon on the form
      cy.findByText('Add').click({ force: true })
      cy.findByText(item).should('be.visible')
    })
  })

  it('should be able to cross off items in a list', () => {
    const name = 'Test!'
    const items = ['Russia', 'Scotland', 'Washington']
    cy.request(`/api/lists`).then((response) => {
      const listToDelete = response.body.find(
        (list: List) => list.name === name
      )

      if (listToDelete) {
        cy.request({
          method: 'DELETE',
          url: `/api/lists/${listToDelete.id}`,
        })
      }
    })

    cy.request({
      method: 'POST',
      url: `/api/lists`,
      body: { name, colorScheme: 'red' },
    }).then((response) => {
      cy.wrap(response.body.id).as('createdListId')
    })

    cy.get<string>('@createdListId').then((listId) => {
      cy.wrap(items).each((item) => {
        cy.request({
          method: 'POST',
          url: `/api/lists/${listId}/items`,
          body: { name: item },
        })
      })
    })

    cy.get<string>('@createdListId').then((listId) => {
      cy.visit(`/lists/${listId}`)
    })

    cy.findByText(name).should('be.visible')
    cy.findByLabelText('Add an item').should('be.visible')

    cy.wrap(items).each((place: string) => {
      cy.findByLabelText(place).click()
      cy.findByLabelText(place).should('be.checked')
    })
  })
})
