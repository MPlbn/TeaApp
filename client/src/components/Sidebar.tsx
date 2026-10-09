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

type SidebarProp = {
    activeView: string;
    onViewChange: (view: string) => void;
}

export default function Sidebar(uProp: SidebarProp){
    
    function handleClick(uViewName: string){
        uProp.onViewChange(uViewName);
    }

    return(
        <Stack gap="lg" h="100%">
          <Title order={3}>TeaApp</Title>

          <Stack>
            <NavLink
              label="Lista herbat"
              leftSection={<IconCoffee size={20}/>}
              active={uProp.activeView === 'TeaListView'}
              onClick={() => handleClick('TeaListView')}
            />
            <NavLink
              label="Dodanie herbaty"
              leftSection={<IconCirclePlus size={20}/>}
              active={uProp.activeView === 'AddTeaView'}
              onClick={() => handleClick('AddTeaView')}
            />
            <NavLink
              label="Edycja herbaty"
              leftSection={<IconEdit size={20}/>}
              active={uProp.activeView === 'EditTeaView'}
              onClick={() => handleClick('EditTeaView')}
            />
            <NavLink
              label="Usunięcie herbaty"
              leftSection={<IconCircleMinus size={20}/>}
              active={uProp.activeView === 'DeleteTeaView'}
              onClick={() => handleClick('DeleteTeaView')}
            />            
          </Stack>

          <Stack>
            <NavLink
              label="Ustawienia"
              leftSection={<IconSettings size={20}/>}
              active={uProp.activeView === 'SettingsView'}
              onClick={() => uProp.onViewChange('SettingsView')}
            />
          </Stack>
        </Stack>
    );
}