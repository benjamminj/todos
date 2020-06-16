import { List } from '../../src/modules/lists/types'

describe('list profile page', () => {
  beforeEach(() => {
    cy.server()
    cy.task('clearDatabase')
    cy.viewport('iphone-x')
  })

  it('should add items to the front of the list', () => {
    const name = 'Places'
    const items = ['Russia', 'Scotland', 'Washington']

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
        }).then((response) => {
          cy.wrap(response.body.id).as(`${item}__id`)
        })
      })
    })

    cy.get<string>('@createdListId').then((listId) => {
      cy.visit(`/lists/${listId}`)
      cy.route('POST', `**/api/lists/${listId}/items`).as('createListItem')
      cy.route('GET', `**/api/lists/${listId}/items**`).as('getItems')
    })

    cy.findByLabelText('Add an item').type('Orange{enter}')

    cy.wait('@createListItem').then(result => {
      cy.wrap((result.response.body as any).id).as('newItemId')
    })

    cy.wait('@getItems')

    cy.get<string>('@newItemId').then(newItemId => {
      cy.findAllByRole('checkbox').then((items) => {
        expect(items.length).equals(4)
        const $first = items.first()
        expect($first).to.have.attr('value', newItemId)
      })
    })
  })
  it('should only display completed items', () => {
    const name = 'Places'
    const items = ['Russia', 'Scotland', 'Washington']

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
        }).then((response) => {
          cy.wrap(response.body.id).as(`${item}__id`)
        })
      })

      cy.get('@Russia__id').then((id) => {
        cy.request({
          method: 'PATCH',
          url: `/api/lists/${listId}/items/${id}`,
          body: { status: 'completed' },
        })
      })
    })

    cy.get<string>('@createdListId').then((listId) => {
      cy.visit(`/lists/${listId}`)
    })

    cy.findByText('Scotland').should('exist')
    cy.findByText('Washington').should('exist')
    cy.findByText('Russia').should('not.exist')
  })

  it('should remove an item from the list when selecting it', () => {
    const name = 'Places'
    const items = ['Russia', 'Scotland', 'Washington']

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
        }).then((response) => {
          cy.wrap(response.body.id).as(`${item}__id`)
        })
      })
    })

    cy.get<string>('@createdListId').then((listId) => {
      cy.visit(`/lists/${listId}`)
    })

    cy.findByLabelText('Russia').click()
    cy.findByLabelText('Russia').should('be.checked')
    cy.findByLabelText('Russia').should('not.exist')

    cy.findByLabelText('Scotland').should('exist')
    cy.findByLabelText('Washington').should('exist')
  })

  it('should be able to edit the name of a list item', () => {
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
        }).then((response) => {
          cy.wrap(response.body.id).as(`${item}__id`)
        })
      })
    })

    cy.get<string>('@createdListId').then((listId) => {
      cy.visit(`/lists/${listId}`)
    })

    cy.findByText(name).should('be.visible')
    cy.findByLabelText('Add an item').should('be.visible')

    cy.get('@Russia__id').then((itemId) => {
      cy.findByTestId(`ListItem__${itemId}`)
        .findByText('Edit')
        .click({ force: true })
    })

    cy.findByLabelText('Name')
      .should('be.focused')
      .should('have.value', 'Russia')

    cy.findByLabelText('Name').clear().type('England').blur()
    cy.findByLabelText('Russia').should('not.exist')
  })
})
