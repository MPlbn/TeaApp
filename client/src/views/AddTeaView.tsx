import {
    Button,
    Group,
    Paper,
    Select,
    Stack,
    Text,
    TextInput,
    Textarea,
    Title,
    Modal,
    Center,
    NumberInput,
    Grid
} from '@mantine/core';
import { useState } from 'react';
import { TeaType } from '../types/enums';

export default function AddTeaView(){
    const [name, setName] = useState('');
    const [teaType, setTeaType] = useState<TeaType | null>(null);
    const [origin, setOrigin] = useState('');
    const [price, setPrice] = useState<number | string>('');
    const [shop, setShop] = useState('');
    const [description, setDescription] = useState('');
    
    //Modal
    const [isInfoPopupModalOpen, setIsInfoPopupModalOpen] = useState(false);
    const [infoPopupModalMessage, setInfoPopupModalMessage] = useState('');

    function handleClear(){
        setName('');
        setTeaType(null);
        setOrigin('');
        setPrice('');
        setDescription('');
    }
    
    function handleAdd(){
        const tea = {
            name: name.trim(),
            teaType,
            origin: origin.trim(),
            price: price === '' ? null : Number(price),
            shop: shop.trim(),
            description: description.trim()
        };

        console.log('Herbata do dodania:', tea);

        handleClear();

        setInfoPopupModalMessage('Poprawnie dodano herbatę!');
        setIsInfoPopupModalOpen(true);
    }



    return(
        <Stack gap="xl">
            <Modal
                opened={isInfoPopupModalOpen}
                onClose={() => setIsInfoPopupModalOpen(false)}
                title=""
                centered
                withCloseButton={false}
                closeOnClickOutside={false}
                closeOnEscape={false}
            >
                <Stack gap="md">
                    <Center>
                        <Text>{infoPopupModalMessage}</Text>
                    </Center>

                    <Group variant='gradient' justify='center'>
                        <Button
                            onClick={() => setIsInfoPopupModalOpen(false)}
                        >
                            OK
                        </Button>
                    </Group>
                </Stack>
            </Modal>

            <div>
                <Title order={1}>Dodaj herbatę</Title>
                <Text c="dimmed" mt="xs">
                    Uzupełnij informacje o nowej herbacie.
                </Text>
            </div>

            <Paper withBorder p="lg" radius="md">
                <Stack gap="md">
                    <Grid gap="md">
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <TextInput
                                label="Nazwa herbaty"
                                placeholder="np. Huoshan Huang Ya"
                                value={name}
                                onChange={(xValue) => setName(xValue.currentTarget.value)}
                                required
                                />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <Select
                                label="Rodzaj herbaty"
                                placeholder="Wybierz rodzaj"
                                data={[
                                    { value: String(TeaType.White), label: 'Biała' },
                                    { value: String(TeaType.Green), label: 'Zielona' },
                                    { value: String(TeaType.Yellow), label: 'Żółta' },
                                    { value: String(TeaType.Oolong), label: 'Oolong' },
                                    { value: String(TeaType.Black), label: 'Czarna' },
                                    { value: String(TeaType.Heicha), label: 'Heicha' }
                                ]}
                                value={teaType === null ? null : String(teaType)}
                                onChange={
                                    (xValue) => setTeaType(xValue === null ? null : Number(xValue) as TeaType)
                                }
                                required
                                />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <TextInput
                                label='Pochodzenie'
                                placeholder='np. Chiny, Yunnan'
                                value={origin}
                                onChange={
                                    (xValue) => setOrigin(xValue.currentTarget.value)
                                }
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <NumberInput
                                label='Cena PLN/50g'
                                placeholder='45.45 zł'
                                value={price}
                                onChange={setPrice}
                                min={0}
                                decimalScale={2}
                                fixedDecimalScale={false}
                                suffix=' zł'
                                required
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <TextInput
                                label='Sklep'
                                placeholder='Nazwa sklepu, np. e-herbata'
                                value={shop}
                                onChange={
                                    (xValue) => setShop(xValue.currentTarget.value)
                                }
                            />
                        </Grid.Col>
                    
                        <Grid.Col span={12}>
                            <Textarea
                                label='Opis'
                                placeholder='Krótki opis herbaty...'
                                value={description}
                                onChange={
                                    (event) => setDescription(event.currentTarget.value)
                                }
                                minRows={3}
                                autosize
                            />
                        </Grid.Col>
                    </Grid>

                    <Group justify='flex-end' mt="sm">
                        <Button variant='default' onClick={handleClear}>Clear</Button>
                        <Button 
                            variant='gradient'
                            onClick={handleAdd} 
                            disabled={
                                !name.trim() ||
                                teaType === null ||
                                price === ''
                            }
                        >
                            Add
                        </Button>
                    </Group>

                </Stack>
            </Paper>

        </Stack>
    );
}