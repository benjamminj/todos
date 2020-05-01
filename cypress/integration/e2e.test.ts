describe('E2E', () => {
  beforeEach(() => {
    cy.server()
    cy.viewport('iphone-x')
  })

  it('should be able to view a list', () => {
    cy.visit('/')

    cy.wrap([
      { name: 'People', count: 3, id: 'b9y7rp6wt' },
      { name: 'Places', count: 3, id: 'pu74257m9' },
      { name: 'Things', count: 4, id: '0suhn5703' },
    ]).each(
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

    cy.findByText('No items yet!').should('be.visible')
    cy.findByText('Test Addition').should('be.visible')

    cy.wrap(['First', 'Second', 'Third']).each((item: string) => {
      cy.findByLabelText('Add an item').type(item)

      // Hidden element, this is the "+" icon on the form
      cy.findByText('Add').click({ force: true })
      cy.findByText(item).should('be.visible')
    })
  })

  it('should be able to cross off items in a list', () => {
    // TODO: might need to scale this up once we have a DB, will need to seed it
    // via the API
    const listId = 'pu74257m9'
    cy.visit(`/lists/${listId}`)

    cy.findByText('Places').should('be.visible')
    cy.findByLabelText('Add an item').should('be.visible')

    cy.wrap(['Russia', 'Scotland', 'Washington']).each((place: string) => {
      cy.findByLabelText(place).click()
      cy.findByLabelText(place).should('be.checked')
    })
  })

  it('should be able to edit the name of a list', () => {
    // TODO: might need to scale this up once we have a DB, will need to seed it
    // via the API
    const listId = 'pu74257m9'
    cy.visit(`/lists/${listId}`)

    cy.findByText('Places').should('be.visible')
    cy.findByLabelText('Add an item').should('be.visible')

    const itemId = '8i1efj9z2'
    cy.findByTestId(`ListItem__${itemId}`)
      .findByText('Edit')
      .click({ force: true })

    cy.findByLabelText('Name')
      .should('be.focused')
      .should('have.value', 'Russia')

    cy.findByLabelText('Name').clear().type('England').blur()
    cy.findByLabelText('Russia').should('not.exist')
  })
})
