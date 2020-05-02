import {
  generateMockLists,
  getMockLists,
  getMockListItems,
} from '../__mocks__/list.data'
import { ListService } from '../list.service'
import { ListColorScheme, ListItem } from '../types'

describe('ListService', () => {
  beforeEach(() => {
    generateMockLists()
  })

  test('should allow you get a list by its id', () => {
    expect(ListService.getListById('b9y7rp6wt')).toEqual({
      colorScheme: 'cyan',
      id: 'b9y7rp6wt',
      itemIds: ['0l28pul1z', 'pyq6efgzn', 'ws27so32t'],
      name: 'People',
    })
  })

  test('should allow you to expand the items in a list', () => {
    expect(ListService.getListById('b9y7rp6wt', { expand: 'items' })).toEqual({
      colorScheme: 'cyan',
      id: 'b9y7rp6wt',
      itemIds: ['0l28pul1z', 'pyq6efgzn', 'ws27so32t'],
      items: [
        {
          description: null,
          id: '0l28pul1z',
          listId: 'b9y7rp6wt',
          name: 'Bill',
          status: 'todo',
        },
        {
          description: null,
          id: 'pyq6efgzn',
          listId: 'b9y7rp6wt',
          name: 'Susie',
          status: 'todo',
        },
        {
          description: null,
          id: 'ws27so32t',
          listId: 'b9y7rp6wt',
          name: 'George',
          status: 'todo',
        },
      ],
      name: 'People',
    })
  })

  test('should throw if trying to get list with an invalid id', () => {
    expect(() => ListService.getListById('potato')).toThrow()
  })

  test('should allow you update a list by its id', () => {
    const newItem = {
      colorScheme: 'gray' as ListColorScheme,
      id: 'b9y7rp6wt',
      itemIds: ['0l28pul1z', 'pyq6efgzn', 'ws27so32t'],
      name: 'Peoplez',
    }

    expect(
      ListService.updateList('b9y7rp6wt', {
        name: newItem.name,
        colorScheme: newItem.colorScheme,
      })
    ).toEqual(newItem)

    expect(ListService.getListById('b9y7rp6wt')).toEqual(newItem)
  })

  test('should throw if trying to update list with an invalid id', () => {
    expect(() => ListService.updateList('potato', { name: 'Potato' })).toThrow()
  })

  test('should allow you to create a new list', () => {
    const newItem = {
      colorScheme: 'gray' as ListColorScheme,
      itemIds: [],
      name: 'Placez',
    }

    const created = ListService.createList({
      name: newItem.name,
      colorScheme: newItem.colorScheme,
    })

    expect(created).toEqual({ ...newItem, id: created.id })

    expect(ListService.getListById(created.id)).toEqual(created)
  })

  test('should allow you to delete a list', () => {
    const id = 'b9y7rp6wt'
    expect(ListService.deleteList('b9y7rp6wt')).toEqual({
      colorScheme: 'cyan',
      id: 'b9y7rp6wt',
      itemIds: ['0l28pul1z', 'pyq6efgzn', 'ws27so32t'],
      name: 'People',
    })

    expect(getMockLists()[id]).toBeUndefined()
  })

  test('should throw if trying to delete list with an invalid id', () => {
    expect(() => ListService.deleteList('potato')).toThrow()
  })

  // Placing "get all" at the end makes sure that our tests are properly setting
  // up / tearing down state in between.
  test('should allow you to get all lists', () => {
    expect(ListService.getAllLists()).toEqual([
      {
        colorScheme: 'cyan',
        id: 'b9y7rp6wt',
        itemIds: ['0l28pul1z', 'pyq6efgzn', 'ws27so32t'],
        name: 'People',
      },
      {
        colorScheme: 'red',
        id: 'pu74257m9',
        itemIds: ['8i1efj9z2', 'jichpr763', 'gzcw77yl5'],
        name: 'Places',
      },
      {
        colorScheme: 'purple',
        id: '0suhn5703',
        itemIds: ['aliim5287', '8j5pe6tji', 'pb99ri9dx', 'pb99ri9dx'],
        name: 'Things',
      },
    ])
  })

  describe('#getListItems', () => {
    test('should allow you to get all items in a list', () => {
      const listId = 'b9y7rp6wt'
      expect(ListService.getListItems(listId)).toEqual([
        {
          description: null,
          id: '0l28pul1z',
          listId: 'b9y7rp6wt',
          name: 'Bill',
          status: 'todo',
        },
        {
          description: null,
          id: 'pyq6efgzn',
          listId: 'b9y7rp6wt',
          name: 'Susie',
          status: 'todo',
        },
        {
          description: null,
          id: 'ws27so32t',
          listId: 'b9y7rp6wt',
          name: 'George',
          status: 'todo',
        },
      ])
    })

    test('should throw error if the list id does not exist', () => {
      expect(() => ListService.getListItems('potato')).toThrow()
    })
  })

  describe('#createNewListItem', () => {
    test('should allow you to create a new item in a list', () => {
      const itemDto = { name: 'Joe' }
      const listId = 'b9y7rp6wt'

      const newItem = ListService.createNewListItem(listId, itemDto)

      expect(newItem).toMatchObject({
        description: null,
        listId: 'b9y7rp6wt',
        name: 'Joe',
        status: 'todo',
      })

      expect(ListService.getListById(listId).itemIds).toContain(newItem.id)
    })

    test('should throw an error if creating a list item without a name', () => {
      const listId = 'b9y7rp6wt'

      // @ts-ignore
      expect(() => ListService.createNewListItem(listId, {})).toThrow()
      expect(() =>
        ListService.createNewListItem(listId, { name: '' })
      ).toThrow()
    })

    test('should throw an error if creating a list item in a nonexistent list', () => {
      const itemDto = { name: 'Joe' }
      const listId = 'potato'

      expect(() => ListService.createNewListItem(listId, itemDto)).toThrow()
    })
  })

  describe('#updateListItem', () => {
    test('should update the item', () => {
      const itemId = '0l28pul1z'
      const updateDto = {
        name: 'Joe',
        status: 'completed' as ListItem['status'],
      }

      const updated = ListService.updateListItem(itemId, updateDto)

      const items = getMockListItems()
      const item = items[itemId]

      expect(item.name).toEqual('Joe')
      expect(item.status).toEqual('completed')
      expect(updated).toEqual(item)
    })

    test('should throw an error if the item does not exist', () => {
      const itemId = 'potato'
      const updateDto = {
        name: 'Joe',
        status: 'completed' as ListItem['status'],
      }

      expect(() => ListService.updateListItem(itemId, updateDto)).toThrow()
    })

    test('should throw an error if a falsy name is added', () => {
      const itemId = '0l28pul1z'
      expect(() =>
        ListService.updateListItem(itemId, {
          // @ts-ignore
          name: null,
        })
      ).toThrow()

      expect(() =>
        ListService.updateListItem(itemId, {
          // @ts-ignore
          name: undefined,
        })
      ).toThrow()

      expect(() => ListService.updateListItem(itemId, { name: '' })).toThrow()
    })

    test('should throw an error if a non-valid status is applied', () => {
      const itemId = '0l28pul1z'
      expect(() =>
        // @ts-ignore
        ListService.updateListItem(itemId, { status: 'potato' })
      ).toThrow()
      expect(() =>
        // @ts-ignore
        ListService.updateListItem(itemId, { status: false })
      ).toThrow()
    })
  })
})
