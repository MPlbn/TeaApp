import { ActionIcon, Button, Group, Popover } from "@mantine/core";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import { useState } from "react";

type ItemModificationMenuProps = {
    setModalMode?: React.Dispatch<React.SetStateAction<"Delete" | "Edit" | "Publish" | "Unpublish" | null>>;
}

const ItemModificationMenu = (props: ItemModificationMenuProps) => {
    const [popoverOpened, setPopoverOpened] = useState(false);
    return (
        <Popover
            opened={popoverOpened}
            withArrow
            position="right-start"
        >
            <Popover.Target>
                <ActionIcon
                    variant="subtle"
                    color="gray.7"
                    onClick={() => setPopoverOpened(!popoverOpened)}
                >
                    <IconDotsVertical size={15} />
                </ActionIcon>
            </Popover.Target>

            <Popover.Dropdown>
                <Group>
                    <Button
                        size="xs"
                        variant="outline"
                        onClick={() => {
                            setPopoverOpened(false);
                            props.setModalMode ? props.setModalMode("Edit") : undefined
                        }}
                        leftSection={<IconEdit size={14} />}
                    >Edytuj</Button>
                    <Button
                        size="xs"
                        variant="outline"
                        onClick={() => {
                            setPopoverOpened(false);
                            props.setModalMode ? props.setModalMode("Delete") : undefined
                        }}
                        leftSection={<IconTrash size={14} />}
                        color="red.7"
                    >Usuń</Button>
                </Group>
            </Popover.Dropdown>
        </Popover>
    )
}

export default ItemModificationMenu