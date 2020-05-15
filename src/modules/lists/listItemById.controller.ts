import { NextApiHandler } from 'next'
import { ListService } from './list.service'

export const handler: NextApiHandler = async (req, res) => {
  const itemId = req.query.itemId as string

  try {
    if (req.method === 'PATCH') {
      const updated = await ListService.updateListItem(itemId, req.body)
      res.status(200).json(updated)
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
