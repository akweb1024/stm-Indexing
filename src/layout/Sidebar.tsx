import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  Dashboard, 
  Book, 
  Article, 
  Storage, 
  History 
} from '@mui/icons-material';

const navItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'Journals', icon: <Book />, path: '/journals' },
  { text: 'Papers', icon: <Article />, path: '/papers' },
  { text: 'Databases', icon: <Storage />, path: '/databases' },
  { text: 'Audit Logs', icon: <History />, path: '/audit-logs' },
];

const Sidebar = () => {
  return (
    <Drawer variant="permanent" anchor="left">
      <List>
        {navItems.map((item) => (
          <ListItem button key={item.text} component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
