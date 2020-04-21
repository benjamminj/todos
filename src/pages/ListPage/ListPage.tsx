import { GetServerSideProps } from 'next'

interface ListPageProps {
  id: string
}

export const ListPage = () => {
  return <div>YAY!</div>
}

export const getServerSideProps: GetServerSideProps<ListPageProps> = async (
  ctx
) => {
  return {
    props: {
      id: ctx.query.listId as string,
    },
  }
}
