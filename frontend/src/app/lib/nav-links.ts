import { routeTree } from '@/routeTree.gen';
import { useMemo } from 'react';

export interface NavLink {
  to: string;
  label: string;
}

export interface BuildNavLinksOptions {
  excludeRoot?: boolean;
}

interface RouteNodeLike {
  id?: string;
  fullPath?: string;
  options?: {
    staticData?: {
      navLabel?: string;
      navOrder?: number;
    };
  };
}

interface RouteTreeLike {
  children?: RouteNodeLike[];
}

export function collectNavLinksFromTree(
  tree: unknown,
  options: BuildNavLinksOptions = {},
): NavLink[] {
  const routeTreeLike = tree as RouteTreeLike;
  const children = routeTreeLike?.children;

  if (!Array.isArray(children)) {
    return [];
  }

  const navLinks = children
    .filter((route) => {
      const routeId = String(route?.id ?? route?.fullPath ?? '');
      return Boolean(route?.options?.staticData?.navLabel) && !routeId.includes('$');
    })
    .map((route) => ({
      to: (route.id ?? route.fullPath ?? '/') as string,
      label: route.options!.staticData!.navLabel!,
      order: route.options?.staticData?.navOrder ?? 999,
    }))
    .sort((left, right) => left.order - right.order)
    .map(({ to, label }) => ({ to, label }));

  if (!options.excludeRoot) {
    return navLinks;
  }

  return navLinks.filter((link) => link.to !== '/');
}

export function getNavLinks(): NavLink[] {
  return collectNavLinksFromTree(routeTree);
}

export function getHeaderLinks(): NavLink[] {
  return collectNavLinksFromTree(routeTree, { excludeRoot: true });
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
