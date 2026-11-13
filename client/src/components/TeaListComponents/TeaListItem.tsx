import {
    Paper,
    Text,
    UnstyledButton,
    Group,
    Divider,
    Badge,
    Stack
} from '@mantine/core';
import { ShortTea } from '../../types/Tea';
import { useNavigate } from 'react-router';
import {
    getTeaDetailsPath,
    getTeaTypeColor,
    getTeaTypeStringVersion
} from '../../utils/utils';
import styles from "../../Styles/TeaListItem.module.css"
import { IconChevronRight, IconLeaf } from '@tabler/icons-react';



type TeaListItemProps = {
    shortTea: ShortTea;
    isPublic: boolean;
};

const TeaListItem = (props: TeaListItemProps) => {
    const navigate = useNavigate();

    function handleClick(): void {
        navigate(getTeaDetailsPath(props.shortTea.id, props.isPublic))
    }

    const color = getTeaTypeColor(props.shortTea.type);

    return (
        <UnstyledButton className={styles.item} onClick={handleClick}>
            <Paper withBorder radius="lg" p="md" shadow='xs' className={styles.card}>
                <Group justify="space-between" wrap="nowrap">
                    <Group justify='flex-start'>
                        <IconLeaf size={30} color={color} />
                        <Stack align='flex-start' gap="xs">
                            <Text fw={600} c="teaGreen.9" className={styles.name}>
                                {props.shortTea.name}
                            </Text>

                            <Text size="sm" c="dimmed" className={styles.origin}>
                                {props.shortTea.origin}
                            </Text>
                        </Stack>
                    </Group>
                    <Stack align='flex-end'>
                        <Badge leftSection={<IconLeaf size={15} />} color={color} variant="filled" size="sm">
                            {getTeaTypeStringVersion(props.shortTea.type)}
                        </Badge>

                        <IconChevronRight
                            size={18}
                            color="var(--mantine-color-dimmed)"
                        />
                    </Stack>
                </Group>
            </Paper>
        </UnstyledButton>
    );
}
export default TeaListItem;