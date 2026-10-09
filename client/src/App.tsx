import {useState} from 'react';
import {
  AppShell,
  NavLink,
  Stack,
  Text,
  Title
} from '@mantine/core';
import {
  IconCirclePlus,
  IconCircleMinus,
  IconCoffee,
  IconEdit,
  IconLeaf,
  IconSettings
} from '@tabler/icons-react';

export default function App(){
  const [activeView, setActiveView] = useState('TeaListView');

  return(
    <AppShell
      navbar={{
        width: 240,
        breakpoint: 0
      }}
      padding="xl"
    >
      <AppShell.Navbar p="md">
        
      </AppShell.Navbar>

      <AppShell.Main>
        {activeView === 'TeaListView' && (
          <>
            <Title order={1}>Moje herbaty</Title>
            <Text c="dimmed" mt="sm">
              Tutaj będzie Twoja kolekcja herbat.
            </Text>
          </>
        )}

        {activeView === 'AddTeaView' && (
          <Title order={1}>Dodawanie herbaty</Title>
        )}

        {activeView === 'EditTeaView' && (
          <Title order={1}>Edycaj herbaty</Title>
        )}

        {activeView === 'DeleteTeaView' && (
          <Title order={1}>Usuwanie herbaty</Title>
        )}

        {activeView === 'SettingsView' && (
          <Title order={1}>Ustawienia</Title>
        )}
      </AppShell.Main>

    </AppShell>
  );
}