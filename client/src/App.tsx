import {useState} from 'react';
import {
  AppShell,
  Title
} from '@mantine/core';
import Sidebar from './components/Sidebar';
import { ViewType }  from './types/enums';
import SettingsView from './views/SettingsView';
import AddTeaView from './views/AddTeaView';
import TeaListView from './views/TeaListView';
import { Route, Routes, Navigate, useLocation, useNavigate } from 'react-router';
import TeaDetailsView from './views/TeaDetailsView';

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
        <Sidebar />
      </AppShell.Navbar>

      <AppShell.Main>
        <Routes>
          <Route 
            path="/"
            element={<Navigate to={ViewType.TeaListView} replace />}
          />

          <Route
            path={ViewType.TeaListView}
            element={
              <TeaListView 
                onTeaSelect={function () {}}
              />
            }
          />

          <Route
            path={`${ViewType.TeaListView}/:id`}
            element={
              <TeaDetailsView
              
              />
            }
          />

          <Route 
            path={ViewType.AddTeaView}
            element={<AddTeaView />}
          />

          <Route 
            path={ViewType.SettingsView}
            element={<SettingsView />}
          />

          <Route 
            path={ViewType.EditTeaView}
            element={<Title order={1}>Edycja herbaty</Title>}
          />

          <Route 
            path={ViewType.DeleteTeaView}
            element={<Title order={1}>Usuwanie herbaty</Title>}
          />

          <Route 
            path="*"
            element={<Navigate to={ViewType.TeaListView} replace />}
          />
        </Routes>
      </AppShell.Main>

    </AppShell>
  );
}