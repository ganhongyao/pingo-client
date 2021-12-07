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
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

type DrawerListItem = {
  text: string;
  link: string;
  icon: JSX.Element;
};

const drawerListMainItems: DrawerListItem[] = [
  { text: "Dashboard", link: "/dashboard", icon: <InboxIcon /> },
  { text: "Chats", link: "/chats", icon: <InboxIcon /> },
  { text: "Friends", link: "/friends", icon: <InboxIcon /> },
  { text: "Past Hangouts", link: "/historyg", icon: <InboxIcon /> },
];

const drawerListSecondaryItems: DrawerListItem[] = [
  { text: "Settings", link: "/settings", icon: <InboxIcon /> },
  { text: "Log out", link: "/logout", icon: <InboxIcon /> },
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
