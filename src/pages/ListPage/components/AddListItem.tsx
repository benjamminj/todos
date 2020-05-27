import { jsx } from '@emotion/core'
import { fetch } from '../../../lib/fetch'
import { FunctionComponent, useState } from 'react'
import { useMutation } from 'rhdf'
import { Box } from '../../../components/Box'
import { Fab } from '../../../components/Fab'
import { Input } from '../../../components/Input'
import { PlusIcon } from '../../../components/PlusIcon'
import { List, ListItem } from '../../../modules/lists/types'
import { spacing } from '../../../styles/spacing'
/** @jsx jsx */ jsx

interface AddItemProps {
  listId: string
}

export const AddListItem: FunctionComponent<AddItemProps> = ({ listId }) => {
  const { mutate } = useMutation<Required<List> | null>({
    key: `/lists/${listId}/items`,
  })
  const [name, setName] = useState('')

  return (
    <Box css={{ position: 'relative' }}>
      <form
        onSubmit={(ev) => {
          ev.preventDefault()
          if (!name) return

          // optimistic update
          mutate((prevItems) => {
            if (!prevItems) return null
            const newItem: ListItem = {
              id: `OPTIMISTIC_${name}`,
              listId,
              name,
              status: 'todo',
            }

            return [newItem, ...(prevItems || [])] as Required<ListItem[]>
          })

          // actual API update
          mutate(async (prevItems) => {
            if (!prevItems) return null

            const newItem = await fetch(`/api/lists/${listId}/items`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name }),
            }).then((res) => res.json())

            return [
              newItem,
              ...prevItems.filter(
                (item: ListItem) => item.id !== `OPTIMISTIC_${name}`
              ),
            ]
          })

          setName('')
        }}
      >
        <Input
          name="itemName"
          label="Add an item"
          placeholder="Add an item"
          elevation="inset"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />

        <Fab
          label="Add"
          type="submit"
          css={{
            position: 'absolute',
            top: '50%',
            right: spacing.small,
            transform: 'translateY(-50%)',
          }}
        >
          <PlusIcon />
        </Fab>
      </form>
    </Box>
  )
}
