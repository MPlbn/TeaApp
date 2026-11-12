import {
  NavLink,
  Paper,
  Stack,
  Title
} from '@mantine/core';
import { navigationItems, bottomNavigationItems } from '../config/SidebarNavigationItems';
import { useLocation, useNavigate } from 'react-router';
import { TablerIcon } from '@tabler/icons-react';
import { ViewType } from '../types/enums';
import { useAppSelector } from '../store/hooks';
import styles from '../Styles/Sidebar.module.css';

export type SidebarItem = {
  label: string;
  icon: TablerIcon;
  view: ViewType;
  availableToRoles: string[];
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);

  function renderNavigationItem(item: SidebarItem) {
    const ItemIcon = item.icon

    const userRoles = user?.roles ?? [];

    const shouldRender = item.availableToRoles.length === 0 || item.availableToRoles.some((role) => userRoles.includes(role));

    if (!shouldRender) return null;

    return (
      <NavLink
        key={item.view}
        label={item.label}
        leftSection={<ItemIcon size={20} stroke={1.7} />}
        active={location.pathname === item.view}
        onClick={() => { navigate(item.view) }}
        classNames={{
          root: styles.navLink,
          label: styles.navLinkLabel
        }}

      />
    );
  }

  return (
    <Paper className={styles.sidebar}>
      <Stack gap="lg" h="100%">
        <Title order={3} fw={600} c="teaGreen.9">
          TeaApp
        </Title>

        <Stack className={styles.navigation}>
          {navigationItems.map(renderNavigationItem)}
        </Stack>

        <Stack className={styles.navigation} mt="auto">
          {bottomNavigationItems.map(renderNavigationItem)}
        </Stack>
      </Stack>
    </Paper>

  );
}
export default Sidebar;