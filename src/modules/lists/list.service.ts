import { getMockLists, getMockListItems } from './__mocks__/list.data'
import { List, ListColorScheme, ListItem } from './types'
import { generateId } from '../../lib/generateId'
import { query, db } from '../../lib/db'

const NotFoundError = new Error('Not found')
const InvalidInputError = new Error('Invalid input')

export class ListService {
  static async getAllLists() {
    return await db
      .select(
        'lists.id',
        'lists.name',
        'lists.color_scheme as colorScheme',
        db.raw(`
          COALESCE(
            array_agg(list_items.id) FILTER(WHERE list_items.id IS NOT NULL), 
            '{}'
          )  as "itemIds"
        `)
      )
      .from('lists')
      .leftJoin('list_items', 'lists.id', 'list_items.list_id')
      .groupBy('lists.id')
  }

  static async getListById(id: string, params: { expand?: 'items' } = {}) {
    if (params.expand === 'items') {
      const [listWithItems] = await db
        .select(
          'lists.id',
          'lists.name',
          'lists.color_scheme as colorScheme',
          db.raw(`
            COALESCE(
              json_agg(list_items) FILTER(WHERE list_items.id IS NOT NULL), 
              '[]'
            )  as "items"
          `)
        )
        .from('lists')
        .where('lists.id', id)
        .leftJoin('list_items', 'lists.id', 'list_items.list_id')
        .groupBy('lists.id')

      if (!listWithItems) throw NotFoundError
      return listWithItems
    }

    const [list] = await db
      .select('id', 'name', 'color_scheme as colorScheme')
      .from('lists')
      .where('id', id)

    if (!list) throw NotFoundError

    return list
  }

  static async createList({
    name,
    colorScheme,
  }: Pick<List, 'name' | 'colorScheme'>) {
    const [newList] = await db
      .insert({ name, color_scheme: colorScheme })
      .into('lists')
      .returning(['id', 'name', 'color_scheme as colorScheme'])

    return newList
  }

  static async updateList(
    id: string,
    { name, colorScheme }: { name?: string; colorScheme?: ListColorScheme }
  ) {
    const [updatedItem] = await db('lists')
      .update({ name, color_scheme: colorScheme })
      .where('id', id)
      .returning(['id', 'name', 'color_scheme as colorScheme'])

    if (!updatedItem) throw NotFoundError
    return updatedItem
  }

  static async deleteList(id: string) {
    const [deletedItem] = await db('lists')
      .where('id', id)
      .delete()
      .returning(['id', 'name', 'color_scheme as colorScheme'])

    if (!deletedItem) throw NotFoundError

    return deletedItem
  }

  static getListItems(listId: string) {
    const lists = getMockLists()
    const list = lists[listId]

    if (!list) throw NotFoundError

    const items = getMockListItems()

    return list.itemIds.map((itemId) => items[itemId]).filter((item) => item)
  }

  static createNewListItem(
    listId: string,
    item: { name: ListItem['name']; status?: ListItem['status'] }
  ) {
    const id = generateId()
    const listItems = getMockListItems()
    const lists = getMockLists()

    const list = lists[listId]

    if (!list) throw NotFoundError
    if (!item.name) throw InvalidInputError
    if (item.status && ['todo', 'completed'].includes(item.status) === false) {
      throw InvalidInputError
    }

    const newItem: ListItem = {
      id,
      listId,
      description: null,
      status: 'todo',
      ...item,
    }

    listItems[id] = newItem
    list.itemIds.push(id)

    return newItem
  }

  static updateListItem(
    itemId: string,
    updates: Partial<Pick<ListItem, 'name' | 'status'>>
  ) {
    const listItems = getMockListItems()
    const item = listItems[itemId]

    const hasNameError = 'name' in updates && !updates.name
    const hasStatusError =
      'status' in updates &&
      ['todo', 'completed'].includes(updates.status as string) === false

    if (hasNameError || hasStatusError) throw InvalidInputError
    if (!item) throw NotFoundError

    listItems[itemId] = {
      ...item,
      ...updates,
    }

    return listItems[itemId]
  }
}
