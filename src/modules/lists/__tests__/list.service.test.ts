import { generateMockLists, getMockLists } from '../__mocks__/list.data'
import { ListService } from '../list.service'
import { ListColorScheme } from '../types'

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
})
