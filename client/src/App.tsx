import {
  AppShell,
} from '@mantine/core';
import Sidebar from './components/Sidebar';
import { ViewType } from './types/enums';
import SettingsView from './components/SettingsComponents/SettingsView';
import TeaAdditionView from './components/AdditionComponents/TeaAdditionView';
import TeaListView from './components/TeaListComponents/TeaListView';
import { Route, Routes, Navigate } from 'react-router';
import TeaDetailsView from './components/TeaDetailsComponents/TeaDetailsView';
import InfoModal from './components/InfoModal';
import UserView from './components/UserComponents/UserView';

export default function App() {

  return (
    <AppShell
      navbar={{
        width: 240,
        breakpoint: 0
      }}
      padding="xl"
    >
      <InfoModal />

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
              <TeaListView />
            }
          />

          <Route
            path={`${ViewType.TeaListView}/:id`}
            element={
              <TeaDetailsView />
            }
          />

          <Route
            path={ViewType.AddTeaView}
            element={<TeaAdditionView />}
          />

          <Route
            path={ViewType.SettingsView}
            element={<SettingsView />}
          />

          <Route
            path={ViewType.UserView}
            element={<UserView />}
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