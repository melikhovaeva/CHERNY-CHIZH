import { getSegmentLabel } from '@/app/lib/breadcrumb-labels'
import { Breadcrumb } from '@/shared/ui/components'
import { Footer, Header } from '@/widgets'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { Providers } from '../providers/Providers'

export const Route = createRootRoute({
  component: () => (
    <Providers>
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
    </Providers>
  ),
})
