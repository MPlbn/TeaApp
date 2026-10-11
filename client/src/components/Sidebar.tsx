import {
    NavLink,
    Stack,
    Title
} from '@mantine/core';
import type { SidebarItem } from '../types/SidebarItem';
import { navigationItems, bottomNavigationItems } from '../config/SidebarNavigationItems';
import { useLocation, useNavigate } from 'react-router';


export default function Sidebar(){
  const navigate = useNavigate();
  const location = useLocation();

  function renderNavigationItem(uItem: SidebarItem) {
    const ItemIcon = uItem.icon
    return(
      <NavLink 
        key={uItem.view}
        label={uItem.label}
        leftSection={<ItemIcon size={20}/>}
        active={location.pathname === uItem.view}
        onClick={function () {
          navigate(uItem.view);
        }}
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