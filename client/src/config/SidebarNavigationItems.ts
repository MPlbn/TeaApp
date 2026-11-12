import {
    IconCirclePlus,
    IconCoffee,
    IconSettings,
    IconUser,
} from '@tabler/icons-react';
import { UserRole, ViewType } from '../types/enums';
import { SidebarItem } from '../components/Sidebar';

export const navigationItems: SidebarItem[] = [
    {
        label: "Publiczna lista herbat",
        icon: IconCoffee,
        view: ViewType.TeaListView,
        availableToRoles: []
    },
    {
        label: "Prywatna lista herbat",
        icon: IconCoffee,
        view: ViewType.PrivateTeaListView,
        availableToRoles: [UserRole.User, UserRole.Admin]
    },
    {
        label: "Naczynia do herbaty",
        icon: IconCoffee,
        view: ViewType.Teaware,
        availableToRoles: [UserRole.User, UserRole.Admin]
    },
    {
        label: "Dodanie herbaty",
        icon: IconCirclePlus,
        view: ViewType.AddTeaView,
        availableToRoles: [UserRole.User, UserRole.Admin]
    },
];

export const bottomNavigationItems: SidebarItem[] = [
    {
        label: "Konto",
        icon: IconUser,
        view: ViewType.UserView,
        availableToRoles: []
    },
    {
        label: "Ustawienia",
        icon: IconSettings,
        view: ViewType.SettingsView,
        availableToRoles: []
    }
];