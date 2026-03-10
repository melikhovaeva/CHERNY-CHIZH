import { routeTree } from '@/routeTree.gen';
import { collectNavLinksFromTree, type NavLink } from 'common';

export function getNavLinks(): NavLink[] {
  return collectNavLinksFromTree(routeTree);
}

export function getHeaderLinks(): NavLink[] {
  return collectNavLinksFromTree(routeTree, { excludeRoot: true });
}

export function getMobileMenuLinks(): NavLink[] {
  return getNavLinks();
}
