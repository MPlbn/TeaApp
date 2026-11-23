import { RequestStatus } from "./enums";
import { PublishRequestDetails } from "./RequestDetails";

export type RequestResponse = {
    id: number;
    details: PublishRequestDetails;
    createdAt: string;
    resolvedAt: string | null;
    resolverUserName: string | null;
    status: RequestStatus;
    ownerId: string | null;
    ownerUserName: string | null;
    resolutionMessage: string | null;
}

export type ResolveRequestDTO = {
    status: RequestStatus;
    resolutionMessage?: string;
}