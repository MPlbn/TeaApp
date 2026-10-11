import { MockTeas } from "../config/MockTeas";

export function getTeaByID(uTeaID: number) {
    return MockTeas.find(
        function (xTea) {
            return xTea.ID === uTeaID;
        }
    );
}