import { jsx } from '@emotion/core'
import fetch from 'isomorphic-unfetch'
import { FunctionComponent, useState } from 'react'
import { useMutation } from 'rhdf'
import { Box } from '../../../components/Box'
import { Fab } from '../../../components/Fab'
import { Input } from '../../../components/Input'
import { PlusIcon } from '../../../components/PlusIcon'
import { List } from '../../../modules/lists/types'
import { spacing } from '../../../styles/spacing'
/** @jsx jsx */ jsx

interface AddItemProps {
  listId: string
}

export const AddListItem: FunctionComponent<AddItemProps> = ({ listId }) => {
  const { mutate } = useMutation<Required<List> | null>({
    key: `/lists/${listId}`,
  })
  const [name, setName] = useState('')

  return (
    <Box css={{ position: 'relative' }}>
      <form
        onSubmit={(ev) => {
          ev.preventDefault()

          mutate(async (prevList) => {
            if (!prevList) return null

            const newItem = await fetch(`/api/lists/${listId}/items`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name }),
            }).then((res) => res.json())

            return {
              ...prevList,
              itemIds: [newItem.id, ...prevList.itemIds],
              items: [newItem, ...prevList.items],
            } as Required<List>
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
