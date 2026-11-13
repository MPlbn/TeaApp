import { Button } from "@mantine/core";

type TeaTypeChooserProps = {
    label: string;
    active: boolean;
    onClick: () => void;
}

const TeaTypeChooser = (props: TeaTypeChooserProps) => {

    return (
        <Button
            variant={props.active ? 'filled' : 'default'}
            color={props.active ? 'teaGreen.7' : 'gray'}
            onClick={props.onClick}
            radius="md"
            size="xs"
        >
            {props.label}
        </Button>
    );
}
export default TeaTypeChooser;