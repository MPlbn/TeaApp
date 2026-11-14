import { PublishRequestStatus } from "./enums";

export type PublishRequestResponse = {
    id: number;
    teaId: number;
    createdAt: string;
    resolvedAt: string | null;
    resolverUsername: string | null;
    status: PublishRequestStatus;
    ownerId: string | null;
    ownerUserName: string | null;
}

export type ResolvePublishRequestRequest = {
    status: PublishRequestStatus;
    resolutionMessage: string | null;
}