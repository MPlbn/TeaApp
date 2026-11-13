import { ActionIcon, Group, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

type TeaDetailsTitleProps = {
    name: string;
    onBack: () => void;
}

const TeaDetailsTitle = (props: TeaDetailsTitleProps) => {
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
        </Group>
    );
}
export default TeaDetailsTitle;