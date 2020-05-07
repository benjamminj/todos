import { NextApiHandler } from 'next'
import { ListService } from './list.service'

export const handler: NextApiHandler = async (req, res) => {
  const id = req.query.listId as string

  try {
    if (req.method === 'GET') {
      const items = await ListService.getListItems(id)
      return res.status(200).json(items)
    }

    if (req.method === 'POST') {
      const newItem = await ListService.createNewListItem(id, req.body)
      return res.status(201).json(newItem)
    }
  } catch (error) {
    if (error.message === 'Not found') {
      return res.status(404).json({ message: 'Not found' })
    }

    if (error.message === 'Invalid input') {
      return res.status(400).json({ message: error.message })
    }

    return res.status(500).json({ message: 'Internal server error' })
  }

  return res.status(405).end()
}
