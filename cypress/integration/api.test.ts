import { List, ListItem } from '../../src/modules/lists/types'

describe('API', () => {
  beforeEach(() => {
    cy.server()
    cy.task('clearDatabase')
  })

  context('GET /api/lists', () => {
    it('should be able to fetch a list of lists', () => {
      cy.request('/api/lists').then((response) => {
        expect(response.status).equals(200)
        expect(response.body).to.be.an('array')
      })
    })
  })

  context('POST /api/lists', () => {
    beforeEach(() => {
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
    const name = 'Test Get One!'

    beforeEach(() => {
      cy.request(`/api/lists`).then((response) => {
        const listsToRemove = response.body
          .filter((list: any) => list.name === name)
          .map((list: any) => list.id)

        cy.wrap(listsToRemove).each((id) => {
          cy.request({
            method: 'DELETE',
            url: `/api/lists/${id}`,
            failOnStatusCode: false,
          })
        })
      })

      cy.request({
        method: 'POST',
        url: `/api/lists`,
        body: { name, colorScheme: 'red' },
      }).then((response) => {
        cy.wrap(response.body.id).as('createdListId')
      })
    })

    it('should return the list with the given id', () => {
      cy.get('@createdListId').then((id) => {
        cy.request(`/api/lists/${id}`).then((response) => {
          expect(response.status).equals(200)
          expect(response.body.name).equals(name)
        })
      })
    })

    it('should allow expanding the items in a list', () => {
      cy.get<string>('@createdListId').then((listId) => {
        cy.wrap(['1', '2', '3']).each((num) => {
          cy.request({
            method: 'POST',
            url: `/api/lists/${listId}/items`,
            body: { name: num },
          })
        })

        cy.request(`/api/lists/${listId}?expand=items`).then((response) => {
          expect(response.status).equals(200)
          expect(response.body.name).equals(name)
          expect(response.body.items).to.have.length(3)
        })
      })
    })

    it('should set items as an empty array if there are no items', () => {
      cy.get('@createdListId').then((id) => {
        cy.request(`/api/lists/${id}?expand=items`).then((response) => {
          expect(response.status).equals(200)
          expect(response.body.name).equals(name)
          expect(response.body.items).to.be.an('array')
          expect(response.body.items).to.have.length(0)
        })
      })
    })

    it('should return 404 if no list was found for the id', () => {
      const listId = '12345'
      cy.request({ url: `/api/lists/${listId}`, failOnStatusCode: false }).then(
        (response) => {
          expect(response.status).equals(404)
        }
      )
    })
  })

  context('PATCH /api/lists/:id', () => {
    const name = 'TEST update list'
    const updateName = 'Potatoes'

    beforeEach(() => {
      cy.request(`/api/lists`).then((response) => {
        const listsToRemove = response.body
          .filter((list: any) => list.name === name || list.name === updateName)
          .map((list: any) => list.id)

        cy.wrap(listsToRemove).each((id) => {
          cy.request({
            method: 'DELETE',
            url: `/api/lists/${id}`,
            failOnStatusCode: false,
          })
        })
      })

      cy.request({
        method: 'POST',
        url: `/api/lists`,
        body: { name, colorScheme: 'red' },
      }).then((response) => {
        cy.wrap(response.body.id).as('createdListId')
      })
    })

    it("should allow you to update a list's name", () => {
      cy.get('@createdListId').then((id) => {
        cy.request({
          method: 'PATCH',
          url: `/api/lists/${id}`,
          body: { name: 'Potatoes' },
        }).then((response) => {
          expect(response.status).equals(200)
          expect(response.body.name).equals('Potatoes')
        })
      })
    })

    it("should allow you to update a list's color scheme", () => {
      cy.get('@createdListId').then((id) => {
        cy.request({
          method: 'PATCH',
          url: `/api/lists/${id}`,
          body: { colorScheme: 'gray' },
        }).then((response) => {
          expect(response.status).equals(200)
          expect(response.body.colorScheme).equals('gray')
        })
      })
    })

    it('should return 404 error if a list by that id does not exist', () => {
      const id = '12345'

      cy.request({
        method: 'PATCH',
        url: `/api/lists/${id}`,
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
        cy.wrap(response.body).as('createdListId')
      })

      cy.get<{ id: string }>('@createdListId').then((list) => {
        cy.request({
          method: 'DELETE',
          url: `/api/lists/${list.id}`,
        }).then((response) => {
          expect(response.status).equals(200)
        })
      })
    })

    it('should 404 if no list with the given id exists', () => {
      const id = '12345'

      cy.request({
        method: 'DELETE',
        url: `/api/lists/${id}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).equals(404)
      })
    })
  })

  context('GET /api/lists/:id/items', () => {
    const name = 'TEST get list items'

    beforeEach(() => {
      cy.request(`/api/lists`).then((response) => {
        const listsToRemove = response.body
          .filter((list: any) => list.name === name)
          .map((list: any) => list.id)

        cy.wrap(listsToRemove).each((id) => {
          cy.request({
            method: 'DELETE',
            url: `/api/lists/${id}`,
            failOnStatusCode: false,
          })
        })
      })

      cy.request({
        method: 'POST',
        url: `/api/lists`,
        body: { name, colorScheme: 'red' },
      }).then((response) => {
        cy.wrap(response.body.id).as('createdListId')
      })
    })

    it('should return all items in the list', () => {
      cy.get('@createdListId').then((id) => {
        cy.wrap(['FIRST', 'SECOND', 'THIRD']).each((itemName) => {
          cy.request({
            method: 'POST',
            url: `/api/lists/${id}/items`,
            body: { name: itemName },
          })
        })

        cy.request(`/api/lists/${id}/items`).then((response) => {
          expect(response.status).equals(200)
          expect(response.body.length).equals(3)
          expect(response.body.map((item: ListItem) => item.name)).deep.equals([
            'FIRST',
            'SECOND',
            'THIRD',
          ])
        })
      })
    })

    it('should 404 if no list with the given id exists', () => {
      const id = '12345'
      cy.request({
        url: `/api/lists/${id}/items`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).equals(404)
        expect(response.body.message).equals('Not found')
      })
    })
  })

  context('POST /api/lists/:id/items', () => {
    const listName = 'TEST LIST create item'
    const name = 'TEST create new list item'

    beforeEach(() => {
      cy.request(`/api/lists`).then((response) => {
        const listsToRemove = response.body
          .filter((list: any) => list.name === listName)
          .map((list: any) => list.id)

        cy.wrap(listsToRemove).each((id) => {
          cy.request({
            method: 'DELETE',
            url: `/api/lists/${id}`,
            failOnStatusCode: false,
          })
        })
      })

      cy.request({
        method: 'POST',
        url: `/api/lists`,
        body: { name: listName, colorScheme: 'red' },
      }).then((response) => {
        cy.wrap(response.body.id).as('listId')
      })
    })

    it('should create a new list item', () => {
      cy.get('@listId').then((listId) => {
        cy.request({
          method: 'POST',
          url: `/api/lists/${listId}/items`,
          body: { name },
        }).then((response) => {
          expect(response.status).equals(201)
          expect(response.body.name).equals(name)
          expect(response.body.status).equals('todo')
        })
      })
    })

    it('should 404 if no list with the given id', () => {
      const id = '12345'
      cy.request({
        method: 'POST',
        url: `/api/lists/${id}/items`,
        body: { name },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).equals(404)
        expect(response.body.message).equals('Not found')
      })
    })

    it('should return 400 if a missing name was passed', () => {
      cy.get('@listId').then((listId) => {
        cy.wrap(['', null]).each((value) => {
          cy.request({
            method: 'POST',
            url: `/api/lists/${listId}/items`,
            body: { name: value },
            failOnStatusCode: false,
          }).then((response) => {
            expect(response.status).equals(400)
            expect(response.body.message).equals('Invalid input')
          })
        })
      })
    })

    it('should return 400 if an invalid status was passed', () => {
      cy.get('@listId').then((listId) => {
        cy.request({
          method: 'POST',
          url: `/api/lists/${listId}/items`,
          body: { name, status: 'test!' },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).equals(400)
          expect(response.body.message).equals('Invalid input')
        })
      })
    })
  })

  context('PATCH /api/lists/:listId/items/:itemId', () => {
    const itemId = '0l28pul1z'
    const url = (listId: string, itemId: string) =>
      `/api/lists/${listId}/items/${itemId}`

    const listName = 'TEST LIST update item'
    const itemName = 'TEST ITEM update item'

    beforeEach(() => {
      cy.request(`/api/lists`).then((response) => {
        const listsToRemove = response.body
          .filter((list: any) => list.name === listName)
          .map((list: any) => list.id)

        cy.wrap(listsToRemove).each((id) => {
          cy.request({
            method: 'DELETE',
            url: `/api/lists/${id}`,
            failOnStatusCode: false,
          })
        })
      })

      cy.request({
        method: 'POST',
        url: `/api/lists`,
        body: { name: listName, colorScheme: 'red' },
      }).then((response) => {
        cy.wrap(response.body.id).as('listId')
      })

      cy.get('@listId').then((id) => {
        cy.request({
          method: 'POST',
          url: `/api/lists/${id}/items`,
          body: { name: itemName },
        }).then((response) => {
          cy.wrap(response.body.id).as('createdItemId')
        })
      })
    })

    it('should allow updating an item', () => {
      cy.get<string>('@listId').then((listId) => {
        cy.get<string>('@createdItemId').then((id) => {
          cy.request({
            method: 'PATCH',
            url: url(listId, id),
            body: { name: 'William', status: 'completed' },
          }).then((response) => {
            expect(response.status).equals(200)
            expect(response.body.name).equals('William')
            expect(response.body.status).equals('completed')
          })
        })
      })
    })

    it('should 404 if no item with the given id exists', () => {
      const id = '12345'
      cy.get<string>('@listId').then((listId) => {
        cy.request({
          method: 'PATCH',
          url: url(listId, id),
          body: { name: 'William', status: 'completed' },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).equals(404)
          expect(response.body.message).equals('Not found')
        })
      })
    })

    it('should 400 if a falsy name is passed', () => {
      cy.get<string>('@listId').then((listId) => {
        cy.get<string>('@createdItemId').then((id) => {
          cy.wrap(['', null]).each((value) => {
            cy.request({
              method: 'PATCH',
              url: url(listId, id),
              body: { name: value },
              failOnStatusCode: false,
            }).then((response) => {
              expect(response.status).equals(400)
              expect(response.body.message).equals('Invalid input')
            })
          })
        })
      })
    })

    it('should 400 if a invalid status is passed', () => {
      cy.get<string>('@listId').then((listId) => {
        cy.get<string>('@createdItemId').then((id) => {
          cy.request({
            method: 'PATCH',
            url: url(listId, id),
            body: { status: 'potato' },
            failOnStatusCode: false,
          }).then((response) => {
            expect(response.status).equals(400)
            expect(response.body.message).equals('Invalid input')
          })
        })
      })
    })
  })
})
