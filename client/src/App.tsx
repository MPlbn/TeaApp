import {useState} from 'react';
import {
  AppShell,
  Text,
  Title
} from '@mantine/core';
import Sidebar from './components/Sidebar';
import { ViewType }  from './types/enums';
import SettingsView from './views/SettingsView';

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
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
        />
      </AppShell.Navbar>

      <AppShell.Main>
        {activeView === ViewType.TeaListView && (
          <>
            <Title order={1}>Moje herbaty</Title>
            <Text c="dimmed" mt="sm">
              Tutaj będzie Twoja kolekcja herbat.
            </Text>
          </>
        )}

        {activeView === ViewType.AddTeaView && (
          <Title order={1}>Dodawanie herbaty</Title>
        )}

        {activeView === ViewType.EditTeaView && (
          <Title order={1}>Edycja herbaty</Title>
        )}

        {activeView === ViewType.DeleteTeaView && (
          <Title order={1}>Usuwanie herbaty</Title>
        )}

        {activeView === ViewType.SettingsView && (
          <SettingsView />
        )}
      </AppShell.Main>

    </AppShell>
  );
}