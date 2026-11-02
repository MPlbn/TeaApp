import { useAppSelector } from "../../store/hooks";
import UserLoggedInView from "./UserLoggedInView";
import UserNotLoggedInView from "./UserNotLoggedInView";

const UserView = () => {
    const accessToken = useAppSelector((state) => state.auth.accessToken);

    if (accessToken) {
        return (
            <UserLoggedInView />
        )
    }
    else {
        return (
            <UserNotLoggedInView />
        )
    }
}
export default UserView;