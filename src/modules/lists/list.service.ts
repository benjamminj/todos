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

  static async getListItems(listId: string) {
    try {
      const lists = await db('lists').where('id', listId)

      if (lists.length !== 1) throw NotFoundError

      const returnedItems = await db('list_items').where('list_id', listId)
      return returnedItems
    } catch (error) {
      if (error.code === '23503') throw NotFoundError
      throw error
    }
  }

  static async createNewListItem(
    listId: string,
    item: { name: ListItem['name']; status?: ListItem['status'] }
  ) {
    if (!item.name) throw InvalidInputError
    if (item.status && ['todo', 'completed'].includes(item.status) === false) {
      throw InvalidInputError
    }

    try {
      const [returnedItem] = await db
        .insert({ ...item, list_id: listId })
        .into('list_items')
        .returning(['id', 'name', 'status', 'description'])

      return returnedItem
    } catch (error) {
      if (error.code === '23503') throw NotFoundError
      throw error
    }
  }

  static async updateListItem(
    itemId: string,
    updates: Partial<Pick<ListItem, 'name' | 'status'>>
  ) {
    const hasNameError = 'name' in updates && !updates.name
    const hasStatusError =
      'status' in updates &&
      ['todo', 'completed'].includes(updates.status as string) === false
    if (hasNameError || hasStatusError) throw InvalidInputError

    try {
      const [updatedItem] = await db('list_items')
        .update(updates)
        .where('id', itemId)
        .returning(['id', 'name', 'status'])

      if (!updatedItem) throw NotFoundError
      return updatedItem
    } catch (error) {
      throw error
    }
  }
}
