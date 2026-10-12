import {
    NavLink,
    Stack,
    Title
} from '@mantine/core';
import { navigationItems, bottomNavigationItems } from '../config/SidebarNavigationItems';
import { useLocation, useNavigate } from 'react-router';
import { TablerIcon } from '@tabler/icons-react';
import { ViewType } from '../types/enums';


export type SidebarItem = {
    label: string;
    icon: TablerIcon;
    view: ViewType
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  function renderNavigationItem(item: SidebarItem) {
    const ItemIcon = item.icon
    return(
      <NavLink 
        key={item.view}
        label={item.label}
        leftSection={<ItemIcon size={20}/>}
        active={location.pathname === item.view}
        onClick={() => {navigate(item.view)}}
      />
    );
  }

  return(
      <Stack gap="lg" h="100%">
        <Title order={3}>TeaApp</Title>
        <Stack gap="xs">
          {navigationItems.map(renderNavigationItem)}    
        </Stack>
        <Stack gap="xs" mt="auto">
          {bottomNavigationItems.map(renderNavigationItem)}
        </Stack>
      </Stack>
  );
}
export default Sidebar;