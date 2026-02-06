/// <reference types="vite/client" />

declare module '*.svg?react' {
  import type { FunctionComponent, SVGProps } from 'react'
  const component: FunctionComponent<SVGProps<SVGSVGElement>>
  export default component
}

declare module '*.webp' {
  const url: string
  export default url
}
