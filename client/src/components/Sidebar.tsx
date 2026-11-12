import {
  NavLink,
  Stack,
  Title
} from '@mantine/core';
import { navigationItems, bottomNavigationItems } from '../config/SidebarNavigationItems';
import { useLocation, useNavigate } from 'react-router';
import { TablerIcon } from '@tabler/icons-react';
import { UserRole, ViewType } from '../types/enums';
import { useAppSelector } from '../store/hooks';


export type SidebarItem = {
  label: string;
  icon: TablerIcon;
  view: ViewType;
  availableToRoles: string[];
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  function renderNavigationItem(item: SidebarItem) {
    const ItemIcon = item.icon

    const user = useAppSelector((state) => state.auth.user);

    const userRoles = user?.roles ?? [];

    const shouldRender = item.availableToRoles.length === 0 || item.availableToRoles.some((role) => userRoles.includes(role));

    if (!shouldRender) return null;

    return (
      <NavLink
        key={item.view}
        label={item.label}
        leftSection={<ItemIcon size={20} />}
        active={location.pathname === item.view}
        onClick={() => { navigate(item.view) }}
      />
    );
  }

  return (
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