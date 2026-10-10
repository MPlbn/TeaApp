import {
  IconCirclePlus,
  IconCircleMinus,
  IconCoffee,
  IconEdit,
  IconSettings,
} from '@tabler/icons-react';
import { ViewType } from '../types/enums';
import type { SidebarItem } from '../types/SidebarItem';

export const navigationItems: SidebarItem[] = [
    {
        label: "Lista herbat",
        icon: IconCoffee,
        view: ViewType.TeaListView,
    },
    {
        label: "Dodanie herbaty",
        icon: IconCirclePlus,
        view: ViewType.AddTeaView,
    },
    {
        label: "Edycja herbaty",
        icon: IconEdit,
        view: ViewType.EditTeaView,
    },
    {
        label: "Usunięcie herbaty",
        icon: IconCircleMinus,
        view: ViewType.DeleteTeaView,
    },
];

export const bottomNavigationItems: SidebarItem[] = [
    {
        label: "Ustawienia",
        icon: IconSettings,
        view: ViewType.SettingsView,
    }
];