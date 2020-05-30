import { jsx } from '@emotion/core'
import { fetch } from '../../../lib/fetch'
import { FunctionComponent, useState } from 'react'
import { Box } from '../../../components/Box'
import { Fab } from '../../../components/Fab'
import { Input } from '../../../components/Input'
import { PlusIcon } from '../../../components/PlusIcon'
import { ListItem as ListItemInterface } from '../../../modules/lists/types'
import { spacing } from '../../../styles/spacing'
import { useMutation, queryCache } from 'react-query'
/** @jsx jsx */ jsx

interface AddItemProps {
  listId: string
}

type AddListItemFn = (listId: string, name: string) => Promise<void>

/**
 * Make an API call to add an todo list item to the list with the given id.
 */
const addListItem: AddListItemFn = async (listId, name) => {
  await fetch(`/api/lists/${listId}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  }).then((res) => res.json())
}

/**
 * A form which, when submitted, adds a list item to the given list id.
 */
export const AddListItem: FunctionComponent<AddItemProps> = ({ listId }) => {
  const [name, setName] = useState('')

  const [mutate] = useMutation(
    ({ name }: { name: string }) => addListItem(listId, name),
    {
      onMutate: ({ name }) => {
        queryCache.cancelQueries(['listItems', listId])
        const previousItems = queryCache.getQueryData(['listItems', listId])

        const newItem: ListItemInterface = {
          id: `OPTIMISTIC_${name}`,
          listId,
          name,
          status: 'todo',
        }

        queryCache.setQueryData(
          ['listItems', listId],
          (oldItems?: ListItemInterface[]) => {
            if (!oldItems) return [newItem]
            return [newItem, ...oldItems]
          }
        )

        return () => {
          return queryCache.setQueryData(['listItems', listId], previousItems)
        }
      },
      onError: (_err, _variables, rollback) => {
        if (typeof rollback === 'function') {
          rollback()
        }
      },
      onSettled: () => {
        queryCache.refetchQueries(['listItems', listId])
      },
    }
  )

  return (
    <Box css={{ position: 'relative' }}>
      <form
        onSubmit={(ev) => {
          ev.preventDefault()
          if (!name) return
          mutate({ name })
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
