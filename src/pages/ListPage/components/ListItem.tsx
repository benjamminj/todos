import { jsx } from '@emotion/core'
import { Box } from '../../../components/Box'
import { Card } from '../../../components/Card'
import { Column } from '../../../components/Column'
import { Columns } from '../../../components/Columns'
import { EditIcon } from '../../../components/EditIcon'
import { Fab } from '../../../components/Fab/Fab'
import { spacing } from '../../../styles/spacing'
import { FunctionComponent, useState } from 'react'
import { Input } from '../../../components/Input'
import { Text } from '../../../components/Text'
import { CloseIcon } from '../../../components/CloseIcon'
import { ListService } from '../../../modules/lists/list.service'
import { useMutation } from 'rhdf'
import { List } from '../../../modules/lists/types'
import { Checkbox } from '../../../components/Checkbox'
/** @jsx jsx */ jsx

export interface ListItemProps {
  name: string
  id: string
  listId: string
}

export const ListItem: FunctionComponent<ListItemProps> = ({
  name,
  id,
  listId,
}) => {
  const [editing, setEditing] = useState(false)
  const { mutate } = useMutation<Required<List> | undefined>(`/lists/${listId}`)

  return (
    <Card
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
                // Prevents the text inside the input from wiggling
                // when toggled back and forth
                marginLeft: spacing.xsmall * -1 - 2,
              }}
              defaultValue={name}
              label="Name"
              onBlur={(ev) => {
                mutate(async (prevList) => {
                  if (!prevList) return

                  const updatedItem = await ListService.updateListItem(id, {
                    name: ev.target.value,
                  })

                  return {
                    ...prevList,
                    items:
                      prevList.items.map((item) =>
                        item.id === updatedItem.id ? updatedItem : item
                      ) || [],
                  }
                })

                setEditing(false)
              }}
            />
          ) : (
            <Checkbox label={name} />
            // <Text>{name}</Text>
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
