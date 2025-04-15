import TABS from 'Routes/route';
import { userLogout } from 'Services/users';

const getPages = () => ({
  heading: 'Pages',
  id: 'page',
  items: TABS.filter(({ main }) => main)
    .map(({ id, url, label, children }) => {
      if (children) {
        return children.map(({ id, url: childUrl, label }) => ({
          id,
          icon: 'LinkIcon',
          href: `/app/${url}/${childUrl}`,
          children: label,
        }));
      }
      return { id, icon: 'LinkIcon', href: `/app/${url}`, children: label };
    })
    .flat(1),
});

const getActions = (navigate) => ({
  heading: 'Actions',
  id: 'actions',
  items: [
    {
      id: 'log-out',
      children: 'Log out',
      icon: 'ArrowRightOnRectangleIcon',
      onClick: () => {
        userLogout();
        navigate('/login');
      },
    },
  ],
});

export const getOptions = (navigate) => {
  return [getPages(navigate), getActions(navigate)];
};
