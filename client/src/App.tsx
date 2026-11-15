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
import UserView from './components/UserComponents/UserView';
import styles from './Styles/App.module.css';
import { AnimatePresence, motion } from 'motion/react';
import { useLocation, useNavigationType } from 'react-router';
import TestView from './components/TestView';
import PendingRequestsView from './components/PendingRequestsComponents/PendingRequestsView';
import MyRequestsView from './components/MyRequestsComponents/MyRequestsView';
import TeaWareListView from './components/TeaWareComponents/TeaWareListView';

const pageVariants = {
  initial: (direction: number) => ({
    x: direction * 60,
    opacity: 0
  }),
  animate: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction * -60,
    opacity: 0
  })
};

export default function App() {
  const location = useLocation();

  const navigationType = useNavigationType();

  const direction = navigationType === "POP" ? -1 : 1;

  return (
    <AppShell
      navbar={{
        width: 260,
        breakpoint: 0
      }}
      padding="xl"
      className={styles.appShell}
    >
      <AppShell.Navbar className={styles.navbar}>
        <Sidebar />
      </AppShell.Navbar>

      <AppShell.Main className={styles.main}>
        <AnimatePresence mode='wait' custom={direction}>
          <motion.div
            key={location.pathname}
            custom={direction}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: 0.1,
              ease: "easeInOut"
            }}
          >
            <Routes location={location}>
              <Route
                path="/"
                element={<Navigate to={ViewType.TeaListView} replace />}
              />

              <Route
                path={ViewType.TeaListView}
                element={
                  <TeaListView isPublic={true} />
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
                element={<TeaListView isPublic={false} />}
              />

              <Route
                path={ViewType.Teaware}
                element={<TeaWareListView />}
              />

              <Route
                path={ViewType.MyRequestsView}
                element={<MyRequestsView />}
              />

              <Route
                path={ViewType.AdminRequestResolutionView}
                element={<PendingRequestsView />}
              />

              <Route
                path={ViewType.TestView}
                element={<TestView />}
              />

              <Route
                path="*"
                element={<Navigate to={ViewType.TeaListView} replace />}
              />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </AppShell.Main>

    </AppShell>
  );
}