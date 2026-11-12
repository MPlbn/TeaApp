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
import TeaListViewPrivate from './components/TeaListComponents/TeaListViewPrivate';
import styles from './Styles/App.module.css';

export default function App() {

  return (
    <AppShell
      navbar={{
        width: 260,
        breakpoint: 0
      }}
      padding="xl"
      className={styles.appShell}
    >
      <InfoModal />

      <AppShell.Navbar className={styles.navbar}>
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
              <TeaDetailsView isPublic={true} />
            }
          />

          <Route
            path={`${ViewType.PrivateTeaListView}/:id`}
            element={
              <TeaDetailsView isPublic={false} />
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
            path={ViewType.PrivateTeaListView}
            element={<TeaListViewPrivate />}
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