import { Button } from "@mantine/core";

type TeaTypeChooserProps = {
    label: string;
    active: boolean;
    onClick: () => void;
}

export default function TeaTypeChooser(uProp: TeaTypeChooserProps) {
    function handleClick(): void {
        uProp.onClick();
    }
    
    return (
        <Button
            variant={uProp.active ? 'filled' : 'default'}
            color={uProp.active ? 'teal' : 'gray'}
            onClick={handleClick}
        >
            {uProp.label}
        </Button>
    );
}
