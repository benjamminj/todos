import { jsx } from '@emotion/core'
import { Card } from '../../../components/Card'
import { Column } from '../../../components/Column'
import { Columns } from '../../../components/Columns'
import { EditIcon } from '../../../components/EditIcon'
import { Fab } from '../../../components/Fab/Fab'
import { spacing } from '../../../styles/spacing'
import { FunctionComponent, useState } from 'react'
import { Input } from '../../../components/Input'
import { CloseIcon } from '../../../components/CloseIcon'
import { useMutation } from 'rhdf'
import {
  List,
  ListItem as ListItemInterface,
} from '../../../modules/lists/types'
import { Checkbox } from '../../../components/Checkbox'
import { fetch } from '../../../lib/fetch'
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

export const ListItem: FunctionComponent<ListItemProps> = ({
  name,
  id,
  listId,
  status,
}) => {
  const [editing, setEditing] = useState(false)
  const { mutate } = useMutation<Required<List> | undefined>({
    key: `/lists/${listId}`,
  })

  const updateItem = (update: Partial<ListItemInterface>) => {
    // optimistic update
    mutate((prevList) => {
      if (!prevList) return

      const updatedItem = {
        name,
        id,
        listId,
        status,
        ...update,
      }

      const updatedList = {
        ...prevList,
        items:
          prevList.items.map((item: ListItemInterface) =>
            item.id === updatedItem.id ? updatedItem : item
          ) || [],
      }

      return updatedList
    })

    // actual update
    mutate(async (prevList) => {
      console.log('RUN ACTUAL')
      if (!prevList) return

      const updatedItem = await fetch(`/api/lists/${listId}/items/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(update),
      }).then((res) => res.json())

      const updatedList = {
        ...prevList,
        items:
          prevList.items.map((item: ListItemInterface) =>
            item.id === updatedItem.id ? updatedItem : item
          ) || [],
      }

      return updatedList
    })
  }

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
            updateItem(form)
            setEditing(false)
          }}
          name={name}
        />
      ) : (
        <Columns css={{ alignItems: 'center' }}>
          <Column>
            <Checkbox
              label={name}
              checked={status === 'completed'}
              onChange={(ev) => {
                const status = ev.target.checked ? 'completed' : 'todo'

                updateItem({ status })
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
