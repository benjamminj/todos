import { ListService } from './list.service'
import { NextApiHandler } from 'next'
import { listColors } from './types'

export const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    const lists = await ListService.getAllLists()
    return res.status(200).json(lists)
  }

  if (req.method === 'POST') {
    const payload = req.body

    if (!payload.name || !payload.colorScheme) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    if (!Object.keys(listColors).includes(payload.colorScheme)) {
      return res.status(400).json({ message: 'Invalid color scheme' })
    }

    const list = await ListService.createList(req.body)
    return res.status(201).json(list)
  }

  res.status(405).end()
}
