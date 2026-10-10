import { TablerIcon } from "@tabler/icons-react";
import { ViewType } from "./enums";

export type SidebarItem = {
    label: string;
    icon: TablerIcon;
    view: ViewType
};