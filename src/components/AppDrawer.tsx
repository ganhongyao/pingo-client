import {
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import MapIcon from "@mui/icons-material/Map";
import PeopleIcon from "@mui/icons-material/People";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

type DrawerListItem = {
  text: string;
  link: string;
  icon: JSX.Element;
};

const drawerListMainItems: DrawerListItem[] = [
  { text: "Dashboard", link: "/dashboard", icon: <MapIcon /> },
  { text: "Chats", link: "/chats", icon: <ChatIcon /> },
  { text: "Friends", link: "/friends", icon: <PeopleIcon /> },
  { text: "Past Hangouts", link: "/history", icon: <HistoryIcon /> },
];

const drawerListSecondaryItems: DrawerListItem[] = [
  { text: "Settings", link: "/settings", icon: <SettingsIcon /> },
  { text: "Log out", link: "/logout", icon: <LogoutIcon /> },
];

export default function AppDrawer() {
  const navigate = useNavigate();

  function makeDrawerListItem(item: DrawerListItem) {
    return (
      <ListItem button key={item.text} onClick={() => navigate(item.link)}>
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.text} />
      </ListItem>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>{drawerListMainItems.map(makeDrawerListItem)}</List>
        <Divider />
        <List>{drawerListSecondaryItems.map(makeDrawerListItem)}</List>
      </Box>
    </Drawer>
  );
}
