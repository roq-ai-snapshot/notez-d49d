const mapping: Record<string, string> = {
  cards: 'card',
  notes: 'note',
  organizations: 'organization',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
