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
            color={props.active ? 'teal' : 'gray'}
            onClick={props.onClick}
        >
            {props.label}
        </Button>
    );
}
export default TeaTypeChooser;