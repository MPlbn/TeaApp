import{
    Paper,
    Text,
    UnstyledButton,
    Group,
    Divider
} from '@mantine/core';
import { ShortTea } from '../../types/Tea';
import { useNavigate } from 'react-router';
import { 
    getTeaDetailsPath,
    getTeaTypeStringVerison
} from '../../utils/utils';

type TeaListItemProps = {
    shortTea: ShortTea;
};

const TeaListItem = (props: TeaListItemProps) => {
    const navigate = useNavigate();

    function handleClick(): void {
        navigate(getTeaDetailsPath(props.shortTea.id))
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
                    {props.shortTea.name}
                </Text>

                <Divider orientation="vertical" />

                <Text size="sm" c="dimmed" style={{ flex: 1 }} ta="center">
                    {getTeaTypeStringVerison(props.shortTea.type)}
                </Text>

                <Divider orientation="vertical" />

                <Text size="sm" style={{ flex: 1 }} ta="right">
                    {props.shortTea.origin}
                </Text>
                </Group>
            </Paper>
        </UnstyledButton>      
    );
}
export default TeaListItem;