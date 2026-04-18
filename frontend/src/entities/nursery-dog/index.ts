export { useInfiniteNurseryDogs } from './hooks/useInfiniteNurseryDogs';

export {
  useNurseryDogsFilteredListQuery,
  useV1NurseryDogsListQuery,
  useV1NurseryDogsRetrieveQuery,
  useV1NurseryDogsCreateMutation,
  useV1NurseryDogsUpdateMutation,
  useV1NurseryDogsPartialUpdateMutation,
  useV1NurseryDogsDestroyMutation,
  useV1NurseryDogsDocumentsDestroyMutation,
  useV1NurseryDogsPhotosDestroyMutation,
  useNurserySetMainPhotoMutation,
  useNurseryUploadPhotoMutation,
  useNurseryUploadDocumentMutation,
  useNurseryPublishMutation,
  useNurseryUnpublishMutation,
} from './api/nurseryDog.api';

export type {
  DogListRead,
  DogAdminWrite,
  DogPhotosRead,
  DogDocumentsRead,
  PaginatedDogListListRead,
  AgeGroupEnum,
  SexEnum,
  PotentialEnum,
  DogAdminWriteStatusEnum,
  DocumentTypeEnum,
} from '@/shared/api/generated/nursery.generated';
