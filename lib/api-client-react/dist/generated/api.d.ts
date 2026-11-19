import type { DataTag, DefinedInitialDataOptions, DefinedUseQueryResult, QueryClient, QueryKey, UndefinedInitialDataOptions, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { AlertInput, ChatInput, ChatMessage, CompanyInput, ControlActivity, ControlAlert, ControlCompany, ControlDocument, ControlMe, ControlMember, ControlMessage, ControlNotification, ControlOverview, ControlRecord, DocumentInput, DocumentMetadata, DownloadLink, EmailSettings, ExportControlReportParams, HealthStatus, IntegrationStatus, ListControlRecordsParams, MemberInput, RecordInput, UploadInput, UploadTicket, ValidationInput } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getGetControlMeUrl: () => string;
export declare const getControlMe: (options?: Parameters<typeof customFetch>[1]) => Promise<ControlMe>;
export declare const getGetControlMeQueryKey: () => readonly ["/api/control/me"];
export declare const getGetControlMeQueryOptions: <TData = Awaited<ReturnType<typeof getControlMe>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getControlMe>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getControlMe>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export type GetControlMeQueryResult = NonNullable<Awaited<ReturnType<typeof getControlMe>>>;
export type GetControlMeQueryError = ErrorType<unknown>;
export declare function useGetControlMe<TData = Awaited<ReturnType<typeof getControlMe>>, TError = ErrorType<unknown>>(options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getControlMe>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getControlMe>>, TError, Awaited<ReturnType<typeof getControlMe>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useGetControlMe<TData = Awaited<ReturnType<typeof getControlMe>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getControlMe>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getControlMe>>, TError, Awaited<ReturnType<typeof getControlMe>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useGetControlMe<TData = Awaited<ReturnType<typeof getControlMe>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getControlMe>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare const getCreateControlCompanyUrl: () => string;
export declare const createControlCompany: (companyInput: CompanyInput, options?: Parameters<typeof customFetch>[1]) => Promise<ControlCompany>;
export declare const getCreateControlCompanyMutationKey: () => readonly ["createControlCompany"];
export declare const getCreateControlCompanyMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createControlCompany>>, TError, CreateControlCompanyMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createControlCompany>>, TError, CreateControlCompanyMutationVariables, TContext>;
export type CreateControlCompanyMutationResult = NonNullable<Awaited<ReturnType<typeof createControlCompany>>>;
export type CreateControlCompanyMutationBody = BodyType<CompanyInput>;
export type CreateControlCompanyMutationError = ErrorType<unknown>;
export type CreateControlCompanyMutationVariables = {
    data: BodyType<CompanyInput>;
};
export declare const useCreateControlCompany: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createControlCompany>>, TError, CreateControlCompanyMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof createControlCompany>>, TError, CreateControlCompanyMutationVariables, TContext>;
export declare const getGetControlOverviewUrl: (companyId: string) => string;
export declare const getControlOverview: (companyId: string, options?: Parameters<typeof customFetch>[1]) => Promise<ControlOverview>;
export declare const getGetControlOverviewQueryKey: (companyId: string) => readonly [`/api/control/${string}/overview`];
export declare const getGetControlOverviewQueryOptions: <TData = Awaited<ReturnType<typeof getControlOverview>>, TError = ErrorType<unknown>>(companyId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getControlOverview>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getControlOverview>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export type GetControlOverviewQueryResult = NonNullable<Awaited<ReturnType<typeof getControlOverview>>>;
export type GetControlOverviewQueryError = ErrorType<unknown>;
export declare function useGetControlOverview<TData = Awaited<ReturnType<typeof getControlOverview>>, TError = ErrorType<unknown>>(companyId: string, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getControlOverview>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getControlOverview>>, TError, Awaited<ReturnType<typeof getControlOverview>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useGetControlOverview<TData = Awaited<ReturnType<typeof getControlOverview>>, TError = ErrorType<unknown>>(companyId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getControlOverview>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getControlOverview>>, TError, Awaited<ReturnType<typeof getControlOverview>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useGetControlOverview<TData = Awaited<ReturnType<typeof getControlOverview>>, TError = ErrorType<unknown>>(companyId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getControlOverview>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare const getUpdateControlCompanyUrl: (companyId: string) => string;
export declare const updateControlCompany: (companyId: string, companyInput: CompanyInput, options?: Parameters<typeof customFetch>[1]) => Promise<ControlCompany>;
export declare const getUpdateControlCompanyMutationKey: () => readonly ["updateControlCompany"];
export declare const getUpdateControlCompanyMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateControlCompany>>, TError, UpdateControlCompanyMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateControlCompany>>, TError, UpdateControlCompanyMutationVariables, TContext>;
export type UpdateControlCompanyMutationResult = NonNullable<Awaited<ReturnType<typeof updateControlCompany>>>;
export type UpdateControlCompanyMutationBody = BodyType<CompanyInput>;
export type UpdateControlCompanyMutationError = ErrorType<unknown>;
export type UpdateControlCompanyMutationVariables = {
    companyId: string;
    data: BodyType<CompanyInput>;
};
export declare const useUpdateControlCompany: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateControlCompany>>, TError, UpdateControlCompanyMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof updateControlCompany>>, TError, UpdateControlCompanyMutationVariables, TContext>;
export declare const getListControlRecordsUrl: (companyId: string, params?: ListControlRecordsParams) => string;
export declare const listControlRecords: (companyId: string, params?: ListControlRecordsParams, options?: Parameters<typeof customFetch>[1]) => Promise<ControlRecord[]>;
export declare const getListControlRecordsQueryKey: (companyId: string, params?: ListControlRecordsParams) => readonly [`/api/control/${string}/records`, ...ListControlRecordsParams[]];
export declare const getListControlRecordsQueryOptions: <TData = Awaited<ReturnType<typeof listControlRecords>>, TError = ErrorType<unknown>>(companyId: string, params?: ListControlRecordsParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listControlRecords>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listControlRecords>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export type ListControlRecordsQueryResult = NonNullable<Awaited<ReturnType<typeof listControlRecords>>>;
export type ListControlRecordsQueryError = ErrorType<unknown>;
export declare function useListControlRecords<TData = Awaited<ReturnType<typeof listControlRecords>>, TError = ErrorType<unknown>>(companyId: string, params: undefined | ListControlRecordsParams, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof listControlRecords>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof listControlRecords>>, TError, Awaited<ReturnType<typeof listControlRecords>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useListControlRecords<TData = Awaited<ReturnType<typeof listControlRecords>>, TError = ErrorType<unknown>>(companyId: string, params?: ListControlRecordsParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listControlRecords>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof listControlRecords>>, TError, Awaited<ReturnType<typeof listControlRecords>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useListControlRecords<TData = Awaited<ReturnType<typeof listControlRecords>>, TError = ErrorType<unknown>>(companyId: string, params?: ListControlRecordsParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listControlRecords>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare const getCreateControlRecordUrl: (companyId: string) => string;
export declare const createControlRecord: (companyId: string, recordInput: RecordInput, options?: Parameters<typeof customFetch>[1]) => Promise<ControlRecord>;
export declare const getCreateControlRecordMutationKey: () => readonly ["createControlRecord"];
export declare const getCreateControlRecordMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createControlRecord>>, TError, CreateControlRecordMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createControlRecord>>, TError, CreateControlRecordMutationVariables, TContext>;
export type CreateControlRecordMutationResult = NonNullable<Awaited<ReturnType<typeof createControlRecord>>>;
export type CreateControlRecordMutationBody = BodyType<RecordInput>;
export type CreateControlRecordMutationError = ErrorType<unknown>;
export type CreateControlRecordMutationVariables = {
    companyId: string;
    data: BodyType<RecordInput>;
};
export declare const useCreateControlRecord: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createControlRecord>>, TError, CreateControlRecordMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof createControlRecord>>, TError, CreateControlRecordMutationVariables, TContext>;
export declare const getUpdateControlRecordUrl: (companyId: string, id: string) => string;
export declare const updateControlRecord: (companyId: string, id: string, recordInput: RecordInput, options?: Parameters<typeof customFetch>[1]) => Promise<ControlRecord>;
export declare const getUpdateControlRecordMutationKey: () => readonly ["updateControlRecord"];
export declare const getUpdateControlRecordMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateControlRecord>>, TError, UpdateControlRecordMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateControlRecord>>, TError, UpdateControlRecordMutationVariables, TContext>;
export type UpdateControlRecordMutationResult = NonNullable<Awaited<ReturnType<typeof updateControlRecord>>>;
export type UpdateControlRecordMutationBody = BodyType<RecordInput>;
export type UpdateControlRecordMutationError = ErrorType<unknown>;
export type UpdateControlRecordMutationVariables = {
    companyId: string;
    id: string;
    data: BodyType<RecordInput>;
};
export declare const useUpdateControlRecord: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateControlRecord>>, TError, UpdateControlRecordMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof updateControlRecord>>, TError, UpdateControlRecordMutationVariables, TContext>;
export declare const getDeleteControlRecordUrl: (companyId: string, id: string) => string;
export declare const deleteControlRecord: (companyId: string, id: string, options?: Parameters<typeof customFetch>[1]) => Promise<void>;
export declare const getDeleteControlRecordMutationKey: () => readonly ["deleteControlRecord"];
export declare const getDeleteControlRecordMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteControlRecord>>, TError, DeleteControlRecordMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteControlRecord>>, TError, DeleteControlRecordMutationVariables, TContext>;
export type DeleteControlRecordMutationResult = NonNullable<Awaited<ReturnType<typeof deleteControlRecord>>>;
export type DeleteControlRecordMutationError = ErrorType<unknown>;
export type DeleteControlRecordMutationVariables = {
    companyId: string;
    id: string;
};
export declare const useDeleteControlRecord: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteControlRecord>>, TError, DeleteControlRecordMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof deleteControlRecord>>, TError, DeleteControlRecordMutationVariables, TContext>;
export declare const getRequestControlUploadUrl: (companyId: string) => string;
export declare const requestControlUpload: (companyId: string, uploadInput: UploadInput, options?: Parameters<typeof customFetch>[1]) => Promise<UploadTicket>;
export declare const getRequestControlUploadMutationKey: () => readonly ["requestControlUpload"];
export declare const getRequestControlUploadMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestControlUpload>>, TError, RequestControlUploadMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof requestControlUpload>>, TError, RequestControlUploadMutationVariables, TContext>;
export type RequestControlUploadMutationResult = NonNullable<Awaited<ReturnType<typeof requestControlUpload>>>;
export type RequestControlUploadMutationBody = BodyType<UploadInput>;
export type RequestControlUploadMutationError = ErrorType<unknown>;
export type RequestControlUploadMutationVariables = {
    companyId: string;
    data: BodyType<UploadInput>;
};
export declare const useRequestControlUpload: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestControlUpload>>, TError, RequestControlUploadMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof requestControlUpload>>, TError, RequestControlUploadMutationVariables, TContext>;
export declare const getListControlDocumentsUrl: (companyId: string) => string;
export declare const listControlDocuments: (companyId: string, options?: Parameters<typeof customFetch>[1]) => Promise<ControlDocument[]>;
export declare const getListControlDocumentsQueryKey: (companyId: string) => readonly [`/api/control/${string}/documents`];
export declare const getListControlDocumentsQueryOptions: <TData = Awaited<ReturnType<typeof listControlDocuments>>, TError = ErrorType<unknown>>(companyId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listControlDocuments>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listControlDocuments>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export type ListControlDocumentsQueryResult = NonNullable<Awaited<ReturnType<typeof listControlDocuments>>>;
export type ListControlDocumentsQueryError = ErrorType<unknown>;
export declare function useListControlDocuments<TData = Awaited<ReturnType<typeof listControlDocuments>>, TError = ErrorType<unknown>>(companyId: string, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof listControlDocuments>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof listControlDocuments>>, TError, Awaited<ReturnType<typeof listControlDocuments>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useListControlDocuments<TData = Awaited<ReturnType<typeof listControlDocuments>>, TError = ErrorType<unknown>>(companyId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listControlDocuments>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof listControlDocuments>>, TError, Awaited<ReturnType<typeof listControlDocuments>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useListControlDocuments<TData = Awaited<ReturnType<typeof listControlDocuments>>, TError = ErrorType<unknown>>(companyId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listControlDocuments>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare const getCompleteControlUploadUrl: (companyId: string) => string;
export declare const completeControlUpload: (companyId: string, documentInput: DocumentInput, options?: Parameters<typeof customFetch>[1]) => Promise<ControlDocument>;
export declare const getCompleteControlUploadMutationKey: () => readonly ["completeControlUpload"];
export declare const getCompleteControlUploadMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof completeControlUpload>>, TError, CompleteControlUploadMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof completeControlUpload>>, TError, CompleteControlUploadMutationVariables, TContext>;
export type CompleteControlUploadMutationResult = NonNullable<Awaited<ReturnType<typeof completeControlUpload>>>;
export type CompleteControlUploadMutationBody = BodyType<DocumentInput>;
export type CompleteControlUploadMutationError = ErrorType<unknown>;
export type CompleteControlUploadMutationVariables = {
    companyId: string;
    data: BodyType<DocumentInput>;
};
export declare const useCompleteControlUpload: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof completeControlUpload>>, TError, CompleteControlUploadMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof completeControlUpload>>, TError, CompleteControlUploadMutationVariables, TContext>;
export declare const getUpdateControlDocumentUrl: (companyId: string, id: string) => string;
export declare const updateControlDocument: (companyId: string, id: string, documentMetadata: DocumentMetadata, options?: Parameters<typeof customFetch>[1]) => Promise<ControlDocument>;
export declare const getUpdateControlDocumentMutationKey: () => readonly ["updateControlDocument"];
export declare const getUpdateControlDocumentMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateControlDocument>>, TError, UpdateControlDocumentMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateControlDocument>>, TError, UpdateControlDocumentMutationVariables, TContext>;
export type UpdateControlDocumentMutationResult = NonNullable<Awaited<ReturnType<typeof updateControlDocument>>>;
export type UpdateControlDocumentMutationBody = BodyType<DocumentMetadata>;
export type UpdateControlDocumentMutationError = ErrorType<unknown>;
export type UpdateControlDocumentMutationVariables = {
    companyId: string;
    id: string;
    data: BodyType<DocumentMetadata>;
};
export declare const useUpdateControlDocument: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateControlDocument>>, TError, UpdateControlDocumentMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof updateControlDocument>>, TError, UpdateControlDocumentMutationVariables, TContext>;
export declare const getGetControlDownloadUrl: (companyId: string, id: string) => string;
export declare const getControlDownload: (companyId: string, id: string, options?: Parameters<typeof customFetch>[1]) => Promise<DownloadLink>;
export declare const getGetControlDownloadQueryKey: (companyId: string, id: string) => readonly [`/api/control/${string}/documents/${string}/download`];
export declare const getGetControlDownloadQueryOptions: <TData = Awaited<ReturnType<typeof getControlDownload>>, TError = ErrorType<unknown>>(companyId: string, id: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getControlDownload>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getControlDownload>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export type GetControlDownloadQueryResult = NonNullable<Awaited<ReturnType<typeof getControlDownload>>>;
export type GetControlDownloadQueryError = ErrorType<unknown>;
export declare function useGetControlDownload<TData = Awaited<ReturnType<typeof getControlDownload>>, TError = ErrorType<unknown>>(companyId: string, id: string, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getControlDownload>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getControlDownload>>, TError, Awaited<ReturnType<typeof getControlDownload>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useGetControlDownload<TData = Awaited<ReturnType<typeof getControlDownload>>, TError = ErrorType<unknown>>(companyId: string, id: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getControlDownload>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getControlDownload>>, TError, Awaited<ReturnType<typeof getControlDownload>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useGetControlDownload<TData = Awaited<ReturnType<typeof getControlDownload>>, TError = ErrorType<unknown>>(companyId: string, id: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getControlDownload>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare const getAnalyzeControlDocumentUrl: (companyId: string, id: string) => string;
export declare const analyzeControlDocument: (companyId: string, id: string, options?: Parameters<typeof customFetch>[1]) => Promise<ControlDocument>;
export declare const getAnalyzeControlDocumentMutationKey: () => readonly ["analyzeControlDocument"];
export declare const getAnalyzeControlDocumentMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof analyzeControlDocument>>, TError, AnalyzeControlDocumentMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof analyzeControlDocument>>, TError, AnalyzeControlDocumentMutationVariables, TContext>;
export type AnalyzeControlDocumentMutationResult = NonNullable<Awaited<ReturnType<typeof analyzeControlDocument>>>;
export type AnalyzeControlDocumentMutationError = ErrorType<unknown>;
export type AnalyzeControlDocumentMutationVariables = {
    companyId: string;
    id: string;
};
export declare const useAnalyzeControlDocument: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof analyzeControlDocument>>, TError, AnalyzeControlDocumentMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof analyzeControlDocument>>, TError, AnalyzeControlDocumentMutationVariables, TContext>;
export declare const getValidateControlDocumentUrl: (companyId: string, id: string) => string;
export declare const validateControlDocument: (companyId: string, id: string, validationInput: ValidationInput, options?: Parameters<typeof customFetch>[1]) => Promise<ControlDocument>;
export declare const getValidateControlDocumentMutationKey: () => readonly ["validateControlDocument"];
export declare const getValidateControlDocumentMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof validateControlDocument>>, TError, ValidateControlDocumentMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof validateControlDocument>>, TError, ValidateControlDocumentMutationVariables, TContext>;
export type ValidateControlDocumentMutationResult = NonNullable<Awaited<ReturnType<typeof validateControlDocument>>>;
export type ValidateControlDocumentMutationBody = BodyType<ValidationInput>;
export type ValidateControlDocumentMutationError = ErrorType<unknown>;
export type ValidateControlDocumentMutationVariables = {
    companyId: string;
    id: string;
    data: BodyType<ValidationInput>;
};
export declare const useValidateControlDocument: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof validateControlDocument>>, TError, ValidateControlDocumentMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof validateControlDocument>>, TError, ValidateControlDocumentMutationVariables, TContext>;
export declare const getListControlAlertsUrl: (companyId: string) => string;
export declare const listControlAlerts: (companyId: string, options?: Parameters<typeof customFetch>[1]) => Promise<ControlAlert[]>;
export declare const getListControlAlertsQueryKey: (companyId: string) => readonly [`/api/control/${string}/alerts`];
export declare const getListControlAlertsQueryOptions: <TData = Awaited<ReturnType<typeof listControlAlerts>>, TError = ErrorType<unknown>>(companyId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listControlAlerts>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listControlAlerts>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export type ListControlAlertsQueryResult = NonNullable<Awaited<ReturnType<typeof listControlAlerts>>>;
export type ListControlAlertsQueryError = ErrorType<unknown>;
export declare function useListControlAlerts<TData = Awaited<ReturnType<typeof listControlAlerts>>, TError = ErrorType<unknown>>(companyId: string, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof listControlAlerts>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof listControlAlerts>>, TError, Awaited<ReturnType<typeof listControlAlerts>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useListControlAlerts<TData = Awaited<ReturnType<typeof listControlAlerts>>, TError = ErrorType<unknown>>(companyId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listControlAlerts>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof listControlAlerts>>, TError, Awaited<ReturnType<typeof listControlAlerts>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useListControlAlerts<TData = Awaited<ReturnType<typeof listControlAlerts>>, TError = ErrorType<unknown>>(companyId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listControlAlerts>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare const getSaveControlAlertUrl: (companyId: string) => string;
export declare const saveControlAlert: (companyId: string, alertInput: AlertInput, options?: Parameters<typeof customFetch>[1]) => Promise<ControlAlert>;
export declare const getSaveControlAlertMutationKey: () => readonly ["saveControlAlert"];
export declare const getSaveControlAlertMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof saveControlAlert>>, TError, SaveControlAlertMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof saveControlAlert>>, TError, SaveControlAlertMutationVariables, TContext>;
export type SaveControlAlertMutationResult = NonNullable<Awaited<ReturnType<typeof saveControlAlert>>>;
export type SaveControlAlertMutationBody = BodyType<AlertInput>;
export type SaveControlAlertMutationError = ErrorType<unknown>;
export type SaveControlAlertMutationVariables = {
    companyId: string;
    data: BodyType<AlertInput>;
};
export declare const useSaveControlAlert: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof saveControlAlert>>, TError, SaveControlAlertMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof saveControlAlert>>, TError, SaveControlAlertMutationVariables, TContext>;
export declare const getTestControlAlertUrl: (companyId: string, id: string) => string;
export declare const testControlAlert: (companyId: string, id: string, options?: Parameters<typeof customFetch>[1]) => Promise<ControlMessage>;
export declare const getTestControlAlertMutationKey: () => readonly ["testControlAlert"];
export declare const getTestControlAlertMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof testControlAlert>>, TError, TestControlAlertMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof testControlAlert>>, TError, TestControlAlertMutationVariables, TContext>;
export type TestControlAlertMutationResult = NonNullable<Awaited<ReturnType<typeof testControlAlert>>>;
export type TestControlAlertMutationError = ErrorType<unknown>;
export type TestControlAlertMutationVariables = {
    companyId: string;
    id: string;
};
export declare const useTestControlAlert: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof testControlAlert>>, TError, TestControlAlertMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof testControlAlert>>, TError, TestControlAlertMutationVariables, TContext>;
export declare const getListControlNotificationsUrl: (companyId: string) => string;
export declare const listControlNotifications: (companyId: string, options?: Parameters<typeof customFetch>[1]) => Promise<ControlNotification[]>;
export declare const getListControlNotificationsQueryKey: (companyId: string) => readonly [`/api/control/${string}/notifications`];
export declare const getListControlNotificationsQueryOptions: <TData = Awaited<ReturnType<typeof listControlNotifications>>, TError = ErrorType<unknown>>(companyId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listControlNotifications>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listControlNotifications>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export type ListControlNotificationsQueryResult = NonNullable<Awaited<ReturnType<typeof listControlNotifications>>>;
export type ListControlNotificationsQueryError = ErrorType<unknown>;
export declare function useListControlNotifications<TData = Awaited<ReturnType<typeof listControlNotifications>>, TError = ErrorType<unknown>>(companyId: string, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof listControlNotifications>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof listControlNotifications>>, TError, Awaited<ReturnType<typeof listControlNotifications>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useListControlNotifications<TData = Awaited<ReturnType<typeof listControlNotifications>>, TError = ErrorType<unknown>>(companyId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listControlNotifications>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof listControlNotifications>>, TError, Awaited<ReturnType<typeof listControlNotifications>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useListControlNotifications<TData = Awaited<ReturnType<typeof listControlNotifications>>, TError = ErrorType<unknown>>(companyId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listControlNotifications>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare const getListControlMembersUrl: (companyId: string) => string;
export declare const listControlMembers: (companyId: string, options?: Parameters<typeof customFetch>[1]) => Promise<ControlMember[]>;
export declare const getListControlMembersQueryKey: (companyId: string) => readonly [`/api/control/${string}/members`];
export declare const getListControlMembersQueryOptions: <TData = Awaited<ReturnType<typeof listControlMembers>>, TError = ErrorType<unknown>>(companyId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listControlMembers>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listControlMembers>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export type ListControlMembersQueryResult = NonNullable<Awaited<ReturnType<typeof listControlMembers>>>;
export type ListControlMembersQueryError = ErrorType<unknown>;
export declare function useListControlMembers<TData = Awaited<ReturnType<typeof listControlMembers>>, TError = ErrorType<unknown>>(companyId: string, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof listControlMembers>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof listControlMembers>>, TError, Awaited<ReturnType<typeof listControlMembers>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useListControlMembers<TData = Awaited<ReturnType<typeof listControlMembers>>, TError = ErrorType<unknown>>(companyId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listControlMembers>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof listControlMembers>>, TError, Awaited<ReturnType<typeof listControlMembers>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useListControlMembers<TData = Awaited<ReturnType<typeof listControlMembers>>, TError = ErrorType<unknown>>(companyId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listControlMembers>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare const getSaveControlMemberUrl: (companyId: string) => string;
export declare const saveControlMember: (companyId: string, memberInput: MemberInput, options?: Parameters<typeof customFetch>[1]) => Promise<ControlMember>;
export declare const getSaveControlMemberMutationKey: () => readonly ["saveControlMember"];
export declare const getSaveControlMemberMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof saveControlMember>>, TError, SaveControlMemberMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof saveControlMember>>, TError, SaveControlMemberMutationVariables, TContext>;
export type SaveControlMemberMutationResult = NonNullable<Awaited<ReturnType<typeof saveControlMember>>>;
export type SaveControlMemberMutationBody = BodyType<MemberInput>;
export type SaveControlMemberMutationError = ErrorType<unknown>;
export type SaveControlMemberMutationVariables = {
    companyId: string;
    data: BodyType<MemberInput>;
};
export declare const useSaveControlMember: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof saveControlMember>>, TError, SaveControlMemberMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof saveControlMember>>, TError, SaveControlMemberMutationVariables, TContext>;
export declare const getListControlActivityUrl: (companyId: string) => string;
export declare const listControlActivity: (companyId: string, options?: Parameters<typeof customFetch>[1]) => Promise<ControlActivity[]>;
export declare const getListControlActivityQueryKey: (companyId: string) => readonly [`/api/control/${string}/activity`];
export declare const getListControlActivityQueryOptions: <TData = Awaited<ReturnType<typeof listControlActivity>>, TError = ErrorType<unknown>>(companyId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listControlActivity>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listControlActivity>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export type ListControlActivityQueryResult = NonNullable<Awaited<ReturnType<typeof listControlActivity>>>;
export type ListControlActivityQueryError = ErrorType<unknown>;
export declare function useListControlActivity<TData = Awaited<ReturnType<typeof listControlActivity>>, TError = ErrorType<unknown>>(companyId: string, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof listControlActivity>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof listControlActivity>>, TError, Awaited<ReturnType<typeof listControlActivity>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useListControlActivity<TData = Awaited<ReturnType<typeof listControlActivity>>, TError = ErrorType<unknown>>(companyId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listControlActivity>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof listControlActivity>>, TError, Awaited<ReturnType<typeof listControlActivity>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useListControlActivity<TData = Awaited<ReturnType<typeof listControlActivity>>, TError = ErrorType<unknown>>(companyId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listControlActivity>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare const getListControlChatUrl: (companyId: string) => string;
export declare const listControlChat: (companyId: string, options?: Parameters<typeof customFetch>[1]) => Promise<ChatMessage[]>;
export declare const getListControlChatQueryKey: (companyId: string) => readonly [`/api/control/${string}/chat`];
export declare const getListControlChatQueryOptions: <TData = Awaited<ReturnType<typeof listControlChat>>, TError = ErrorType<unknown>>(companyId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listControlChat>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listControlChat>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export type ListControlChatQueryResult = NonNullable<Awaited<ReturnType<typeof listControlChat>>>;
export type ListControlChatQueryError = ErrorType<unknown>;
export declare function useListControlChat<TData = Awaited<ReturnType<typeof listControlChat>>, TError = ErrorType<unknown>>(companyId: string, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof listControlChat>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof listControlChat>>, TError, Awaited<ReturnType<typeof listControlChat>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useListControlChat<TData = Awaited<ReturnType<typeof listControlChat>>, TError = ErrorType<unknown>>(companyId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listControlChat>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof listControlChat>>, TError, Awaited<ReturnType<typeof listControlChat>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useListControlChat<TData = Awaited<ReturnType<typeof listControlChat>>, TError = ErrorType<unknown>>(companyId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listControlChat>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare const getSendControlChatUrl: (companyId: string) => string;
export declare const sendControlChat: (companyId: string, chatInput: ChatInput, options?: Parameters<typeof customFetch>[1]) => Promise<ChatMessage>;
export declare const getSendControlChatMutationKey: () => readonly ["sendControlChat"];
export declare const getSendControlChatMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendControlChat>>, TError, SendControlChatMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof sendControlChat>>, TError, SendControlChatMutationVariables, TContext>;
export type SendControlChatMutationResult = NonNullable<Awaited<ReturnType<typeof sendControlChat>>>;
export type SendControlChatMutationBody = BodyType<ChatInput>;
export type SendControlChatMutationError = ErrorType<unknown>;
export type SendControlChatMutationVariables = {
    companyId: string;
    data: BodyType<ChatInput>;
};
export declare const useSendControlChat: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendControlChat>>, TError, SendControlChatMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof sendControlChat>>, TError, SendControlChatMutationVariables, TContext>;
export declare const getGetControlIntegrationsUrl: (companyId: string) => string;
export declare const getControlIntegrations: (companyId: string, options?: Parameters<typeof customFetch>[1]) => Promise<IntegrationStatus>;
export declare const getGetControlIntegrationsQueryKey: (companyId: string) => readonly [`/api/control/${string}/integrations`];
export declare const getGetControlIntegrationsQueryOptions: <TData = Awaited<ReturnType<typeof getControlIntegrations>>, TError = ErrorType<unknown>>(companyId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getControlIntegrations>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getControlIntegrations>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export type GetControlIntegrationsQueryResult = NonNullable<Awaited<ReturnType<typeof getControlIntegrations>>>;
export type GetControlIntegrationsQueryError = ErrorType<unknown>;
export declare function useGetControlIntegrations<TData = Awaited<ReturnType<typeof getControlIntegrations>>, TError = ErrorType<unknown>>(companyId: string, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getControlIntegrations>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getControlIntegrations>>, TError, Awaited<ReturnType<typeof getControlIntegrations>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useGetControlIntegrations<TData = Awaited<ReturnType<typeof getControlIntegrations>>, TError = ErrorType<unknown>>(companyId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getControlIntegrations>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getControlIntegrations>>, TError, Awaited<ReturnType<typeof getControlIntegrations>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useGetControlIntegrations<TData = Awaited<ReturnType<typeof getControlIntegrations>>, TError = ErrorType<unknown>>(companyId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getControlIntegrations>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare const getUpdateControlIntegrationsUrl: (companyId: string) => string;
export declare const updateControlIntegrations: (companyId: string, emailSettings: EmailSettings, options?: Parameters<typeof customFetch>[1]) => Promise<IntegrationStatus>;
export declare const getUpdateControlIntegrationsMutationKey: () => readonly ["updateControlIntegrations"];
export declare const getUpdateControlIntegrationsMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateControlIntegrations>>, TError, UpdateControlIntegrationsMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateControlIntegrations>>, TError, UpdateControlIntegrationsMutationVariables, TContext>;
export type UpdateControlIntegrationsMutationResult = NonNullable<Awaited<ReturnType<typeof updateControlIntegrations>>>;
export type UpdateControlIntegrationsMutationBody = BodyType<EmailSettings>;
export type UpdateControlIntegrationsMutationError = ErrorType<unknown>;
export type UpdateControlIntegrationsMutationVariables = {
    companyId: string;
    data: BodyType<EmailSettings>;
};
export declare const useUpdateControlIntegrations: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateControlIntegrations>>, TError, UpdateControlIntegrationsMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof updateControlIntegrations>>, TError, UpdateControlIntegrationsMutationVariables, TContext>;
export declare const getExportControlReportUrl: (companyId: string, format: "pdf" | "xlsx", params?: ExportControlReportParams) => string;
export declare const exportControlReport: (companyId: string, format: "pdf" | "xlsx", params?: ExportControlReportParams, options?: Parameters<typeof customFetch>[1]) => Promise<Blob>;
export declare const getExportControlReportQueryKey: (companyId: string, format: "pdf" | "xlsx", params?: ExportControlReportParams) => readonly [`/api/control/${string}/reports/pdf` | `/api/control/${string}/reports/xlsx`, ...ExportControlReportParams[]];
export declare const getExportControlReportQueryOptions: <TData = Awaited<ReturnType<typeof exportControlReport>>, TError = ErrorType<unknown>>(companyId: string, format: "pdf" | "xlsx", params?: ExportControlReportParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof exportControlReport>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof exportControlReport>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export type ExportControlReportQueryResult = NonNullable<Awaited<ReturnType<typeof exportControlReport>>>;
export type ExportControlReportQueryError = ErrorType<unknown>;
export declare function useExportControlReport<TData = Awaited<ReturnType<typeof exportControlReport>>, TError = ErrorType<unknown>>(companyId: string, format: 'pdf' | 'xlsx', params: undefined | ExportControlReportParams, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof exportControlReport>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof exportControlReport>>, TError, Awaited<ReturnType<typeof exportControlReport>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useExportControlReport<TData = Awaited<ReturnType<typeof exportControlReport>>, TError = ErrorType<unknown>>(companyId: string, format: 'pdf' | 'xlsx', params?: ExportControlReportParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof exportControlReport>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof exportControlReport>>, TError, Awaited<ReturnType<typeof exportControlReport>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useExportControlReport<TData = Awaited<ReturnType<typeof exportControlReport>>, TError = ErrorType<unknown>>(companyId: string, format: 'pdf' | 'xlsx', params?: ExportControlReportParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof exportControlReport>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: Parameters<typeof customFetch>[1]) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof healthCheck>>, TError, Awaited<ReturnType<typeof healthCheck>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof healthCheck>>, TError, Awaited<ReturnType<typeof healthCheck>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export {};
//# sourceMappingURL=api.d.ts.map