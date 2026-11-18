import { ActionIcon, Group, Title } from "@mantine/core";
import { IconArrowLeft, IconUsersGroup } from "@tabler/icons-react";

type TeaDetailsTitleProps = {
    name: string;
    isPublic: boolean;
    onBack: () => void;
}


const TeaDetailsTitle = (props: TeaDetailsTitleProps) => {
    const renderPublicIcon = () => {
        if (props.isPublic) {
            return <IconUsersGroup size={24} />
        }

        return <></>
    }
    return (
        <Group gap="md" align="center">
            <ActionIcon
                variant="subtle"
                color="teaGreen"
                size="lg"
                aria-label="Wróć"
                onClick={props.onBack}
            >
                <IconArrowLeft size={24} />
            </ActionIcon>

            <Title order={1}>
                {props.name}
            </Title>
            {renderPublicIcon()}

        </Group>
    );
}
export default TeaDetailsTitle;