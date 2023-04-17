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

const kecd = {
  id: 'kecd',
  title: <FormattedMessage id="kecd" defaultMessage="KECD" />,
  icon: icons.SchoolIcon,
  type: 'group',
  _children: [
    {
      id: 'subjects',
      title: <FormattedMessage id="subjects" defaultMessage="Subjects" />,
      type: 'item',
      icon: MenuBookIcon,
      url: '/kecd/subjects/list'
    },
    {
      id: 'students',
      title: <FormattedMessage id="students" defaultMessage="Students" />,
      type: 'item',
      icon: Diversity3Icon,
      url: '/kecd/students/list'
    },
    {
      id: 'schools',
      title: <FormattedMessage id="schools" defaultMessage="Schools" />,
      type: 'item',
      icon: Diversity3Icon,
      url: '/kecd/schools/list'
    }
  ],
  get children() {
    return this._children;
  },
  set children(value) {
    this._children = value;
  }
};

export default kecd;
