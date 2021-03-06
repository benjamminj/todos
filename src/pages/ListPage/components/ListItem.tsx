import { jsx } from '@emotion/core'
import { FunctionComponent, useState } from 'react'
import { queryCache, useMutation } from 'react-query'
import { Card } from '../../../components/Card'
import { Checkbox } from '../../../components/Checkbox'
import { CloseIcon } from '../../../components/CloseIcon'
import { Column } from '../../../components/Column'
import { Columns } from '../../../components/Columns'
import { EditIcon } from '../../../components/EditIcon'
import { Fab } from '../../../components/Fab/Fab'
import { Input } from '../../../components/Input'
import { fetch } from '../../../lib/fetch'
import { ListItem as ListItemInterface } from '../../../modules/lists/types'
import { spacing } from '../../../styles/spacing'
import { getListItemsKey } from '../../../modules/lists/queryCacheKeys'
/** @jsx jsx */ jsx

export interface ListItemProps {
  name: string
  id: string
  listId: string
  status: ListItemInterface['status']
}

interface EditItemFormProps {
  onSubmit: (form: { name: string }) => void
  name: string
}

export const EditItemForm: FunctionComponent<EditItemFormProps> = ({
  onSubmit,
  name,
}) => {
  const [value, setValue] = useState(name)

  const handleSubmit = () => onSubmit({ name: value })
  return (
    <form onSubmit={handleSubmit}>
      <Columns alignY="center">
        <Column>
          <Input
            autoFocus
            padding="xsmall"
            css={{
              margin: spacing.xsmall * -1,
            }}
            value={value}
            onChange={(ev) => setValue(ev.target.value)}
            label="Name"
            onBlur={handleSubmit}
          />
        </Column>

        <Column width="content">
          <Fab label={'Done'} type="submit">
            <CloseIcon css={{ fill: '#999' }} />
          </Fab>
        </Column>
      </Columns>
    </form>
  )
}

type UpdateItemFn = (
  listId: string,
  itemId: string,
  update: Partial<ListItemInterface>
) => Promise<ListItemInterface>

const updateItem: UpdateItemFn = async (listId, itemId, update) => {
  const updatedItem = await fetch(`/api/lists/${listId}/items/${itemId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(update),
  }).then((res) => res.json())
  return updatedItem
}

export const ListItem: FunctionComponent<ListItemProps> = ({
  name,
  id,
  listId,
  status,
}) => {
  const [editing, setEditing] = useState(false)

  const [mutate] = useMutation(
    (update: Partial<ListItemInterface>) => updateItem(listId, id, update),
    {
      onMutate: (update) => {
        const cacheKey = getListItemsKey(listId)
        queryCache.cancelQueries(cacheKey)
        const previousItems = queryCache.getQueryData(cacheKey)

        queryCache.setQueryData(cacheKey, (oldItems?: ListItemInterface[]) => {
          if (!oldItems) return []
          return oldItems.map((item) =>
            item.id === id ? { ...item, ...update } : item
          )
        })

        return () => {
          return queryCache.setQueryData(cacheKey, previousItems)
        }
      },
      onError: (_err, _variables, rollback) => {
        if (typeof rollback === 'function') {
          rollback()
        }
      },
      onSettled: () => {
        queryCache.refetchQueries(getListItemsKey(listId))
      },
    }
  )

  return (
    <Card
      data-testid={`ListItem__${id}`}
      css={{
        backgroundColor: '#fff',
        borderRadius: 8,
        border: '1px solid #eaeaea',
      }}
    >
      {editing ? (
        <EditItemForm
          onSubmit={(form) => {
            mutate(form)
            setEditing(false)
          }}
          name={name}
        />
      ) : (
        <Columns css={{ alignItems: 'center' }}>
          <Column>
            <Checkbox
              label={name}
              value={id}
              checked={status === 'completed'}
              onChange={(ev) => {
                const status = ev.target.checked ? 'completed' : 'todo'

                mutate({ status })
              }}
            />
          </Column>

          <Column width="content" css={{ display: 'flex' }}>
            <Fab
              label={editing ? 'Done' : 'Edit'}
              onClick={() => setEditing((wasEditing) => !wasEditing)}
            >
              <EditIcon css={{ fill: '#999' }} />
            </Fab>
          </Column>
        </Columns>
      )}
    </Card>
  )
}
