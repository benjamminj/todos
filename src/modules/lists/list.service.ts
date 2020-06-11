import faunadb from 'faunadb'
import { List, ListColorScheme, ListItem } from './types'

const NotFoundError = new Error('Not found')
const InvalidInputError = new Error('Invalid input')

const secret = process.env.FAUNADB_KEY as string

const q = faunadb.query
const client = new faunadb.Client({ secret })

export class ListService {
  static async getAllLists() {
    const lists = await client.query<{ data: List[] }>(
      q.Map(q.Paginate(q.Match(q.Index('all_lists'))), (ref) =>
        q.Select('data', q.Get(ref))
      )
    )

    return lists.data
  }

  static async getListById(id: string, params: { expand?: 'items' } = {}) {
    try {
      const list = await client.query(
        q.Select('data', q.Get(q.Ref(q.Collection('lists'), id)))
      )

      // NOTE: see if there's a better way in FQL to JOIN this to the query
      // for the lists rather than 2 round trips
      if (params.expand === 'items') {
        const items = await ListService.getListItems(id)
        return { ...list, items }
      }

      return list
    } catch (error) {
      if (error.name === 'NotFound') throw NotFoundError
      throw error
    }
  }

  static async createList({
    name,
    colorScheme,
  }: Pick<List, 'name' | 'colorScheme'>) {
    const id = await client.query(q.NewId())

    const created = await client.query<{ data: List }>(
      q.Create(q.Ref(q.Collection('lists'), id), {
        data: { name, colorScheme, id, itemIds: [] },
      })
    )

    return created.data
  }

  static async updateList(
    id: string,
    updates: { name?: string; colorScheme?: ListColorScheme }
  ) {
    try {
      const updated = await client.query<{ data: List }>(
        q.Update(q.Ref(q.Collection('lists'), id), { data: updates })
      )

      return updated.data
    } catch (error) {
      if (error.name === 'NotFound') throw NotFoundError
      throw error
    }
  }

  static async deleteList(id: string) {
    try {
      const deleted = await client.query<{ data: List }>(
        q.Delete(q.Ref(q.Collection('lists'), id))
      )

      await client.query(
        q.Map(q.Paginate(q.Match(q.Index('items_by_listId'), id)), (ref) =>
          q.Delete(ref)
        )
      )

      return deleted.data
    } catch (error) {
      if (error.name === 'NotFound') throw NotFoundError
      throw error
    }
  }

  static async getListItems(
    listId: string,
    filters: { status?: ListItem['status'] } = {}
  ) {
    try {
      await client.query(q.Get(q.Ref(q.Collection('lists'), listId)))
    } catch (error) {
      if (error.name === 'NotFound') throw NotFoundError
      throw error
    }

    const { status } = filters

    const items = await client.query<{ data: ListItem[] }>(
      q.Map(
        q.Paginate(
          q.If(
            status === undefined,
            q.Match(q.Index('items_by_listId'), listId),
            q.Match(q.Index('items_by_listId_and_status'), [
              listId,
              status as ListItem['status'],
            ])
          )
        ),
        (ref) => q.Select('data', q.Get(ref))
      )
    )

    return items.data
  }

  static async createNewListItem(
    listId: string,
    item: { name: ListItem['name']; status?: ListItem['status'] }
  ) {
    if (!item.name) throw InvalidInputError
    if (item.status && ['todo', 'completed'].includes(item.status) === false) {
      throw InvalidInputError
    }

    const defaultItem = {
      status: 'todo',
    }

    const id = await client.query(q.NewId())

    try {
      const itemIds = await client.query<string[]>(
        q.Select(
          ['data', 'itemIds'],
          q.Get(q.Ref(q.Collection('lists'), listId))
        )
      )

      await client.query(
        q.Update(q.Ref(q.Collection('lists'), listId), {
          data: { itemIds: [...itemIds, id] },
        })
      )

      const created = await client.query<{ data: ListItem }>(
        q.Create(q.Ref(q.Collection('items'), id), {
          data: {
            ...defaultItem,
            ...item,
            id,
            listId,
          },
        })
      )

      return created.data
    } catch (error) {
      if (error.name === 'NotFound') throw NotFoundError
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
      const updated = await client.query<{ data: ListItem }>(
        q.Update(q.Ref(q.Collection('items'), itemId), { data: updates })
      )

      return updated.data
    } catch (error) {
      if (error.name === 'NotFound') throw NotFoundError
      throw error
    }
  }
}
