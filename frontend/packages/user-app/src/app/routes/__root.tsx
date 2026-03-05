import { useSegmentLabel } from '@/app/lib/breadcrumb-labels'
import {
  dictionaryApi,
  useGetDictionariesIndexQuery,
} from '@/entities/dictionary'
import { Breadcrumb } from '@/shared/ui/components'
import { Footer, Header } from '@/widgets'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { useEffect } from 'react'
import { Providers } from '../providers/Providers'

function RootContent() {
  const getSegmentLabel = useSegmentLabel()
  const { data: dictionariesIndex } = useGetDictionariesIndexQuery()

  useEffect(() => {
    if (dictionariesIndex?.puppy) {
      dictionaryApi.util.prefetch('dictionariesRetrieve', { id: 'puppy', pk: 'puppy' }, {
        force: false,
      })
    }
  }, [dictionariesIndex])
  return (
    <>
      <Header />
      <main>
        <Breadcrumb getSegmentLabel={getSegmentLabel} />
        <Outlet />
      </main>
      <Footer />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  )
}

export const Route = createRootRoute({
  component: () => (
    <Providers>
      <RootContent />
    </Providers>
  ),
})
