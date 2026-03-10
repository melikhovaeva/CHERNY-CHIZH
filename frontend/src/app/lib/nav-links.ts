import { routeTree } from '@/routeTree.gen';
import { collectNavLinksFromTree, type NavLink } from '@/shared/common';
import { useMemo } from 'react';

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
