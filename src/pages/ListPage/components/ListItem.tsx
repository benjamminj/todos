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
/** @jsx jsx */ jsx

export interface ListItemProps {
  name: string
  id: string
}

export const ListItem: FunctionComponent<ListItemProps> = ({ name, id }) => {
  const [editing, setEditing] = useState(false)

  return (
    <Card
      css={{
        backgroundColor: '#fff',
        borderRadius: 8,
        border: '1px solid #eaeaea',
      }}
    >
      <Columns css={{ alignItems: 'center' }}>
        <Column width="content" paddingRight="small">
          <Box
            css={{
              width: spacing.large,
              height: spacing.large,
              borderRadius: 8,
              backgroundColor: '#eaeaea',
            }}
          />
        </Column>
        <Column paddingRight="small">
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
                ListService.updateListItem(id, {
                  name: ev.target.value,
                })
                setEditing(false)
              }}
            />
          ) : (
            <Text>{name}</Text>
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
