import {
    IconCirclePlus,
    IconCoffee,
    IconSettings,
    IconUser,
} from '@tabler/icons-react';
import { ViewType } from '../types/enums';
import { SidebarItem } from '../components/Sidebar';

export const navigationItems: SidebarItem[] = [
    {
        label: "Lista herbat",
        icon: IconCoffee,
        view: ViewType.TeaListView
    },
    {
        label: "Dodanie herbaty",
        icon: IconCirclePlus,
        view: ViewType.AddTeaView
    },
];

export const bottomNavigationItems: SidebarItem[] = [
    {
        label: "Konto",
        icon: IconUser,
        view: ViewType.UserView
    },
    {
        label: "Ustawienia",
        icon: IconSettings,
        view: ViewType.SettingsView
    }
];