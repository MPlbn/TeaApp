import {
    NavLink,
    Stack,
    Title
} from '@mantine/core';
import { ViewType } from '../types/enums';
import type { SidebarItem } from '../types/SidebarItem';
import { navigationItems, bottomNavigationItems } from '../config/SidebarNavigationItems';

type SidebarProps = {
    activeView: string;
    onViewChange: (view: ViewType) => void;
}

export default function Sidebar(uProp: SidebarProps){
    
    function handleClick(uViewType: ViewType){
        uProp.onViewChange(uViewType);
    }

    function renderNavigationItem(uItem: SidebarItem) {
      const ItemIcon = uItem.icon

      return(
        <NavLink 
          key={uItem.view}
          label={uItem.label}
          leftSection={<ItemIcon size={20}/>}
          active={uProp.activeView === uItem.view}
          onClick={function () {
            handleClick(uItem.view);
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