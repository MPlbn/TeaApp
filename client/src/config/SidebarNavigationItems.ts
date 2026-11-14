import {
    IconCirclePlus,
    IconLayoutGrid,
    IconSettings,
    IconTeapot,
    IconUser,
} from '@tabler/icons-react';
import { UserRole, ViewType } from '../types/enums';
import { SidebarItem } from '../components/Sidebar';

export const collectionsNavigationItems: SidebarItem[] = [
    {
        label: "Publiczna kolekcja herbat",
        view: ViewType.TeaListView,
        icon: null,
        availableToRoles: [],
        childItems: null
    },
    {
        label: "Prywatna kolekcja herbat",
        view: ViewType.PrivateTeaListView,
        icon: null,
        availableToRoles: [UserRole.User, UserRole.Admin],
        childItems: null
    },
]

export const navigationItems: SidebarItem[] = [
    {
        label: "Kolekcje herbat",
        icon: IconLayoutGrid,
        view: null,
        availableToRoles: [],
        childItems: collectionsNavigationItems
    },
    {
        label: "Naczynia do herbaty",
        icon: IconTeapot,
        view: ViewType.Teaware,
        availableToRoles: [UserRole.User, UserRole.Admin],
        childItems: null
    },
    {
        label: "Dodanie herbaty",
        icon: IconCirclePlus,
        view: ViewType.AddTeaView,
        availableToRoles: [UserRole.User, UserRole.Admin],
        childItems: null
    },
];

export const bottomNavigationItems: SidebarItem[] = [
    {
        label: "Konto",
        icon: IconUser,
        view: ViewType.UserView,
        availableToRoles: [],
        childItems: null
    },
    {
        label: "Ustawienia",
        icon: IconSettings,
        view: ViewType.SettingsView,
        availableToRoles: [],
        childItems: null
    }
];