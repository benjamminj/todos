// import { List } from '../../src/modules/lists/types'

describe('API', () => {
  beforeEach(() => {
    cy.server()
  })

  context('GET /api/lists', () => {
    it('should be able to fetch a list of lists', () => {
      // TODO: will need to reach into DB and seed / delete lists in order to do more testing?

      cy.request('/api/lists').then((response) => {
        expect(response.status).equals(200)
        expect(response.body).to.be.an('array')
      })
    })
  })

  context.only('POST /api/lists', () => {
    beforeEach(() => {
      cy.request('/api/lists')
      cy.request('/api/lists').then((response) => {
        const listsToRemove = response.body
          .filter((list: any) => /Test/g.test(list.name))
          .map((list: any) => list.id)

        cy.wrap(listsToRemove).each((id) => {
          cy.request({
            method: 'DELETE',
            url: `/api/lists/${id}`,
            failOnStatusCode: false,
          })
        })
      })
    })

    it('should be able to create a new list', () => {
      const now = Date.now()

      cy.request({
        method: 'POST',
        url: '/api/lists',
        body: {
          name: `Test ${now}`,
          colorScheme: 'red',
        },
      }).then((response) => {
        expect(response.status).equals(201)

        const list = response.body
        expect(list.id).to.exist
        expect(list.name).equals(`Test ${now}`)
        expect(list.colorScheme).equals('red')
      })
    })

    it('should return a 400 error if an invalid name was passed', () => {
      cy.wrap([null, '']).each((value) => {
        const now = Date.now()
        cy.request({
          method: 'POST',
          url: '/api/lists',
          body: {
            name: value,
            colorScheme: 'purple',
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).equals(400)
          expect(response.body.message).equals('Missing required fields')
        })
      })
    })

    it('should return a 400 error if an invalid color was passed', () => {
      cy.wrap([
        { value: null, message: 'Missing required fields' },
        { value: '', message: 'Missing required fields' },
        { value: 'potato', message: 'Invalid color scheme' },
      ]).each(({ value, message }: { value: unknown; message: string }) => {
        const now = Date.now()
        cy.request({
          method: 'POST',
          url: '/api/lists',
          body: {
            name: `Test ${now}`,
            colorScheme: value,
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).equals(400)
          expect(response.body.message).equals(message)
        })
      })
    })
  })

  context('GET /api/lists/:id', () => {
    it('should return the list with the given id', () => {
      // TODO: need to seed actual list prior to this test
      const listId = 'b9y7rp6wt'
      cy.request(`/api/lists/${listId}`).then((response) => {
        expect(response.status).equals(200)
        expect(response.body.name).equals('People')
      })
    })

    it('should allow expanding the items in a list', () => {
      // TODO: need to seed actual list prior to this test
      const listId = 'b9y7rp6wt'
      cy.request(`/api/lists/${listId}?expand=items`).then((response) => {
        expect(response.status).equals(200)
        expect(response.body.name).equals('People')
        expect(response.body.items).to.have.length(3)
      })
    })

    it('should return 404 if no list was found for the id', () => {
      const listId = 'potato'
      cy.request({ url: `/api/lists/${listId}`, failOnStatusCode: false }).then(
        (response) => {
          expect(response.status).equals(404)
        }
      )
    })
  })

  context('PATCH /api/lists/:id', () => {
    // TODO: need to seed actual list prior to this test
    // TODO: might need to clean up list b/w each run?
    const listId = 'b9y7rp6wt'

    beforeEach(() => {
      // TODO: should probably seed / reset the item directly in the DB when we get
      // there
      cy.request({
        method: 'PATCH',
        url: `/api/lists/${listId}`,
        body: { name: 'People', color: 'cyan' },
      })
    })

    it("should allow you to update a list's name", () => {
      cy.request({
        method: 'PATCH',
        url: `/api/lists/${listId}`,
        body: { name: 'Potatoes' },
      }).then((response) => {
        expect(response.status).equals(200)
        expect(response.body.name).equals('Potatoes')
      })
    })

    it("should allow you to update a list's color scheme", () => {
      cy.request({
        method: 'PATCH',
        url: `/api/lists/${listId}`,
        body: { colorScheme: 'gray' },
      }).then((response) => {
        expect(response.status).equals(200)
        expect(response.body.colorScheme).equals('gray')
      })
    })

    it('should return 404 error if a list by that id does not exist', () => {
      cy.request({
        method: 'PATCH',
        url: `/api/lists/potato`,
        body: { colorScheme: 'gray' },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).equals(404)
        expect(response.body.message).equals('Not found')
      })
    })
  })

  context('DELETE /api/lists/:id', () => {
    it('should allow you to delete a list', () => {
      cy.request({
        method: 'POST',
        url: `/api/lists`,
        body: { name: 'Cypress!', colorScheme: 'red' },
      }).then((response) => {
        cy.wrap(response.body).as('createdList')
      })

      cy.get<{ id: string }>('@createdList').then((list) => {
        cy.request({
          method: 'DELETE',
          url: `/api/lists/${list.id}`,
        }).then((response) => {
          expect(response.status).equals(200)
        })
      })
    })

    it('should 404 if no list with the given id exists', () => {
      cy.request({
        method: 'DELETE',
        url: `/api/lists/potato`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).equals(404)
      })
    })
  })
})
