export interface ProfileMyCourseTag {
  id: string | number;
  label: string;
}

export interface ProfileMyCourseInfo {
  title: string;
  description: string;
  imagePreview?: string | null;
  tags: ProfileMyCourseTag[];
}

export interface ProfileMyCourseEnrollment {
  id: string | number;
  course: ProfileMyCourseInfo;
  status: string;
  progress?: number | null;
}

