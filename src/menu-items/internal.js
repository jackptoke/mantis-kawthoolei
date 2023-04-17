// third-party
import { FormattedMessage } from 'react-intl';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Diversity3Icon from '@mui/icons-material/Diversity3';
// assets
import {
  BuildOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  AppstoreAddOutlined
} from '@ant-design/icons';

// icons
const icons = {
  BuildOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  FileTextOutlined,
  SchoolIcon,
  MenuBookIcon
};

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const internal = {
  id: 'internal',
  title: <FormattedMessage id="internal" defaultMessage="Internal" />,
  icon: icons.SchoolIcon,
  type: 'group',
  _children: [
    {
      id: 'districts',
      title: <FormattedMessage id="districts" defaultMessage="Districts" />,
      type: 'item',
      icon: MenuBookIcon,
      url: '/internal/districts/list'
    },
    {
      id: 'townships',
      title: <FormattedMessage id="townships" defaultMessage="Townships" />,
      type: 'item',
      icon: Diversity3Icon,
      url: '/internal/townships/list'
    },
    {
      id: 'village-tracts',
      title: <FormattedMessage id="village-tracts" defaultMessage="Village Tracts" />,
      type: 'item',
      icon: Diversity3Icon,
      url: '/internal/village-tracts/list'
    },
    {
      id: 'villages',
      title: <FormattedMessage id="villages" defaultMessage="Villages" />,
      type: 'item',
      icon: Diversity3Icon,
      url: '/internal/villages/list'
    }
  ],
  get children() {
    return this._children;
  },
  set children(value) {
    this._children = value;
  }
};

export default internal;
