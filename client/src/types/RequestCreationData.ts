import { RequestType } from "./enums"
import { PublishRequestDetails } from "./RequestDetails";

export type RequestCreationData = {
    type: RequestType;
    details: PublishRequestDetails;
}