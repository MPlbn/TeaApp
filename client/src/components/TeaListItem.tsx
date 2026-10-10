import{
    Paper,
    Text,
    UnstyledButton,
    Group,
    Divider
} from '@mantine/core';
import { Tea } from '../types/Tea';
import { TeaType } from '../types/enums';

type TeaListItemProps = {
    tea: Tea;
    onClick: (xTea: Tea) => void;
};

export default function TeaListItem(uProp: TeaListItemProps) {
    function getTeaTypeLabel(uTeaType: TeaType): string {
        switch (uTeaType){
            case TeaType.White:
                return "Biała";
            case TeaType.Green:
                return "Zielona";
            case TeaType.Yellow:
                return "Żółta";
            case TeaType.Oolong:
                return "Oolong";
            case TeaType.Black:
                return "Czarna";
            case TeaType.Heicha:
                return "Heicha";
            default:
                return "Nieznany rodzaj";
        }
    }

    function handleClick(): void {
        uProp.onClick(uProp.tea);
    }
    return(
        <UnstyledButton
            onClick={handleClick}
            w="100%"
        >
            <Paper
                withBorder
                p="sm"
                radius="md"
            >
                <Group wrap="nowrap" align="stretch" gap="xs">
                <Text fw={600} style={{ flex: 1 }}>
                    {uProp.tea.name}
                </Text>

                <Divider orientation="vertical" />

                <Text size="sm" c="dimmed" style={{ flex: 1 }} ta="center">
                    {getTeaTypeLabel(uProp.tea.teaType)}
                </Text>

                <Divider orientation="vertical" />

                <Text size="sm" style={{ flex: 1 }} ta="right">
                    {uProp.tea.origin}
                </Text>
                </Group>
            </Paper>
        </UnstyledButton>      
    );
}