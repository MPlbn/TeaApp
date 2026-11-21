import { PublishRequestStatus } from "./enums";
import { PublishRequestDetails } from "./RequestDetails";

export type RequestResponse = {
    id: number;
    details: PublishRequestDetails;
    createdAt: string;
    resolvedAt: string | null;
    resolverUsername: string | null;
    status: PublishRequestStatus;
    ownerId: string | null;
    ownerUserName: string | null;
}

export type ResolvePublishRequestRequest = {
    status: PublishRequestStatus;
    resolutionMessage?: string;
}