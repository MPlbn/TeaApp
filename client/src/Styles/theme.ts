import { createTheme, MaskInput, Modal, MultiSelect, NumberInput, PasswordInput, Select, Textarea, TextInput, Title } from "@mantine/core";
import modalStyles from "./Modal.module.css"
import formStyles from "./Form.module.css"

export const theme = createTheme({
    primaryColor: "teaGreen",
    defaultRadius: "lg",

    colors: {
        teaGreen: [
            "#F1F6EF",
            "#E2EDE0",
            "#CDDFCA",
            "#B3CCAE",
            "#91B28D",
            "#789B75",
            "#63865F",
            "#50714D",
            "#405D3E",
            "#304A30",
        ],
        background: [
            "#F7F8F4",
            "#F7F8F4",
            "#F7F8F4",
            "#F7F8F4",
            "#F7F8F4",
            "#F7F8F4",
            "#F7F8F4",
            "#F7F8F4",
            "#F7F8F4",
            "#F7F8F4",
        ],
    },

    headings: {
        fontWeight: "600",
    },

    components: {
        Modal: Modal.extend({
            defaultProps: {
                centered: true,
                size: "lg",
                radius: "lg",
                overlayProps: {
                    backgroundOpacity: 0.45,
                    blur: 2,
                },
            },

            classNames: {
                content: modalStyles.content,
                header: modalStyles.header,
                title: modalStyles.title,
                body: modalStyles.body,
            },
        }),

        TextInput: TextInput.extend({
            defaultProps: {
                size: "md",
                radius: "md"
            },

            classNames: {
                input: formStyles.input,
                label: formStyles.label,
            }
        }),

        PasswordInput: PasswordInput.extend({
            defaultProps: {
                size: "md",
                radius: "md"
            },

            classNames: {
                input: formStyles.input,
                label: formStyles.label,
            }
        }),

        NumberInput: NumberInput.extend({
            defaultProps: {
                size: "md",
                radius: "md"
            },

            classNames: {
                input: formStyles.input,
                label: formStyles.label,
            }
        }),

        Textarea: Textarea.extend({
            defaultProps: {
                size: "md",
                radius: "md",
                minRows: 3,
                autosize: true
            },

            classNames: {
                input: formStyles.input,
                label: formStyles.label,
            }
        }),

        Select: Select.extend({
            defaultProps: {
                size: "md",
                radius: "md"
            },

            classNames: {
                input: formStyles.input,
                label: formStyles.label,
            }
        }),

        MultiSelect: MultiSelect.extend({
            defaultProps: {
                size: "md",
                radius: "md"
            },

            classNames: {
                input: formStyles.input,
                label: formStyles.label,
            }
        }),

        MaskInput: MaskInput.extend({
            defaultProps: {
                size: "md",
                radius: "md"
            },

            classNames: {
                input: formStyles.input,
                label: formStyles.label,
            }
        }),

        Title: Title.extend({
            defaultProps: {
                c: "teaGreen.9"
            }
        })
    },
});
