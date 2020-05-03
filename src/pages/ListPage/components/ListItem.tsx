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
import fetch from 'isomorphic-unfetch'
/** @jsx jsx */ jsx

export interface ListItemProps {
  name: string
  id: string
  listId: string
  status: ListItemInterface['status']
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
    mutate(async (prevList) => {
      if (!prevList) return

      const updatedItem = await fetch(`/api/items/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(update),
      }).then((res) => res.json())
      // const updatedItem = await ListService.updateListItem(id, update)

      return {
        ...prevList,
        items:
          prevList.items.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          ) || [],
      }
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
      <Columns css={{ alignItems: 'center' }}>
        <Column>
          {editing ? (
            <Input
              autoFocus
              padding="xsmall"
              css={{
                margin: spacing.xsmall * -1,
              }}
              defaultValue={name}
              label="Name"
              onBlur={(ev) => {
                updateItem({
                  name: ev.target.value,
                })
                // const updatedItem = await ListService.updateListItem(id, )

                // return {
                //   ...prevList,
                //   items:
                //     prevList.items.map((item) =>
                //       item.id === updatedItem.id ? updatedItem : item
                //     ) || [],
                // }
                // })

                setEditing(false)
              }}
            />
          ) : (
            <Checkbox
              label={name}
              checked={status === 'completed'}
              onChange={(ev) => {
                const status = ev.target.checked ? 'completed' : 'todo'

                updateItem({ status })
              }}
            />
          )}
        </Column>

        <Column width="content" css={{ display: 'flex' }}>
          <Fab
            label={editing ? 'Done' : 'Edit'}
            onClick={() => setEditing((wasEditing) => !wasEditing)}
          >
            {editing ? (
              <CloseIcon css={{ fill: '#999' }} />
            ) : (
              <EditIcon css={{ fill: '#999' }} />
            )}
          </Fab>
        </Column>
      </Columns>
    </Card>
  )
}
