import { ListService } from './list.service'
import { NextApiHandler } from 'next'

export const handler: NextApiHandler = async (req, res) => {
  const id = req.query.listId as string

  try {
    if (req.method === 'GET') {
      if (req.query.expand && req.query.expand !== 'items') {
        return res.status(400).json({ message: 'Expand may only be "items"' })
      }

      const list = await ListService.getListById(id, {
        expand: req.query.expand as 'items',
      })

      return res.status(200).json(list)
    }

    if (req.method === 'PATCH') {
      const updatedList = await ListService.updateList(id, req.body)
      return res.status(200).json(updatedList)
    }

    if (req.method === 'DELETE') {
      const deleted = await ListService.deleteList(id)
      return res.status(200).json(deleted)
    }
  } catch (error) {
    if (error.message === 'Not found') {
      return res.status(404).json({ message: 'Not found' })
    }

    return res.status(500).json({ message: 'Internal server error' })
  }

  return res.status(405).end()
}
