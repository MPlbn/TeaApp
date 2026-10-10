import {
  IconCirclePlus,
  IconCircleMinus,
  IconCoffee,
  IconEdit,
  IconLeaf,
  IconSettings
} from '@tabler/icons-react';
import {
    NavLink,
    Stack,
    Title
} from '@mantine/core';
import { ViewType } from '../types/enums';


type SidebarProp = {
    activeView: string;
    onViewChange: (view: ViewType) => void;
}

export default function Sidebar(uProp: SidebarProp){
    
    function handleClick(uViewType: ViewType){
        uProp.onViewChange(uViewType);
    }

    return(
        <Stack gap="lg" h="100%">
          <Title order={3}>TeaApp</Title>

          <Stack gap="xs">
            <NavLink
              label="Lista herbat"
              leftSection={<IconCoffee size={20}/>}
              active={uProp.activeView === ViewType.TeaListView}
              onClick={() => handleClick(ViewType.TeaListView)}
            />
            <NavLink
              label="Dodanie herbaty"
              leftSection={<IconCirclePlus size={20}/>}
              active={uProp.activeView === ViewType.AddTeaView}
              onClick={() => handleClick(ViewType.AddTeaView)}
            />
            <NavLink
              label="Edycja herbaty"
              leftSection={<IconEdit size={20}/>}
              active={uProp.activeView === ViewType.EditTeaView}
              onClick={() => handleClick(ViewType.EditTeaView)}
            />
            <NavLink
              label="Usunięcie herbaty"
              leftSection={<IconCircleMinus size={20}/>}
              active={uProp.activeView === ViewType.DeleteTeaView}
              onClick={() => handleClick(ViewType.DeleteTeaView)}
            />            
          </Stack>

          <Stack gap="xs" mt="auto">
            <NavLink
              label="Ustawienia"
              leftSection={<IconSettings size={20}/>}
              active={uProp.activeView === ViewType.SettingsView}
              onClick={() => uProp.onViewChange(ViewType.SettingsView)}
            />
          </Stack>
        </Stack>
    );
}