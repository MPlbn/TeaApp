import TeaForm from "../FormComponents/TeaForm";
import { useAppSelector } from "../../store/hooks";



const TeaAdditionView = () => {
    const user = useAppSelector((state) => state.auth.user);
    if (user !== null)

        return (
            <TeaForm
                additionalArgs={{
                    user: user
                }}
            />
        )
}
export default TeaAdditionView;