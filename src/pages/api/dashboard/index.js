// ==============================|| MENU ITEMS - DASHBOARD  ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'dashboard',
  type: 'group',
  icon: 'dashboardOutlined',
  children: [
    {
      id: 'dashboard',
      title: 'dashboard',
      type: 'collapse',
      icon: 'dashboardOutlined',
      children: [
        {
          id: 'default',
          title: 'KECD Dashboard',
          type: 'item',
          url: '/dashboard/default',
          breadcrumbs: false
        },
        {
          id: 'analytics',
          title: 'KDHW Dashboard',
          type: 'item',
          url: '/dashboard/analytics',
          breadcrumbs: false
        }
      ]
    }
  ]
};

// ==============================|| MOCK SERVICES ||============================== //

export default async function handler(req, res) {
  res.status(200).json({ dashboard: dashboard });
}
