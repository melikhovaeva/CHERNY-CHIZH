import { routeTree } from '@/routeTree.gen';
import { useMemo } from 'react';

export interface NavLink {
  to: string;
  label: string;
}

function collectNavLinksFromTree(tree: unknown): NavLink[] {
  const routeTree = tree as {
    children?: Array<{
      id?: string;
      fullPath?: string;
      options?: { staticData?: { navLabel?: string; navOrder?: number } };
    }>;
  };
  const children = routeTree?.children;
  if (!Array.isArray(children)) return [];

  return children
    .filter(
      (r) =>
        r?.options?.staticData?.navLabel &&
        !String(r?.id ?? r?.fullPath ?? '').includes('$'),
    )
    .map((r) => ({
      to: (r.id ?? r.fullPath ?? '/') as string,
      label: r.options!.staticData!.navLabel!,
      order: r.options?.staticData?.navOrder ?? 999,
    }))
    .sort((a, b) => a.order - b.order)
    .map(({ to, label }) => ({ to, label }));
}

export function getNavLinks(): NavLink[] {
  return collectNavLinksFromTree(routeTree);
}

export function getHeaderLinks(): NavLink[] {
  return getNavLinks().filter((link) => link.to !== '/');
}

export function getMobileMenuLinks(): NavLink[] {
  return getNavLinks();
}

export function useHeaderLinks(): NavLink[] {
  return useMemo(() => getHeaderLinks(), []);
}

export function useMobileMenuLinks(): NavLink[] {
  return useMemo(() => getMobileMenuLinks(), []);
}
