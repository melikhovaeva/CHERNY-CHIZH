import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  ArticleContentPreview,
  ArticleCreateEditForm,
  useCreateAdminArticleMutation,
  useDeleteAdminArticleMutation,
  useGetArticleAdminQuery,
  useUpdateArticleMutation,
  useUploadArticleImageMutation,
  type ArticleFormData,
} from '@/entities/article';
import {
  selectInfoSettingsActiveSection,
  setActiveSection,
} from '@/features/info-settings';
import { INFO_SETTINGS_SECTION } from '@/features/info-settings/model/types';
import { LessonArticleEditor } from '@/features/lesson-article-editor';
import { Tabs, type Tab } from '@/features/tabs-filter';
import { getInfoDisplayTitle, INFO_TYPE } from '@/shared/config/info';
import { useError, useSuccess } from '@/shared/ui/components/Toast';
import { InfoActionsSection, InfoSettingsTemplate } from '@/widgets';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import ArrowLeftIcon from '@/shared/ui/components/Modal/assets/arrow-left.svg?react';
import styles from './ArticleWorkspacePage.module.scss';

const ARTICLE_CABINET_LIST_PATH = '/cabinet/articles' as const;

const WORKSPACE_TITLE_MAX_LENGTH = 16;

const ARTICLE_WORKSPACE_TAB = {
  PREVIEW: 'preview',
  CONSTRUCTOR: 'constructor',
  SETTINGS: 'settings',
} as const;

type ArticleWorkspaceTab =
  (typeof ARTICLE_WORKSPACE_TAB)[keyof typeof ARTICLE_WORKSPACE_TAB];

export const ArticleWorkspacePage = () => {
  const dispatch = useAppDispatch();
  const activeSettingsSection = useAppSelector(selectInfoSettingsActiveSection);
  const { articleSlug } = useParams({ strict: false });
  const navigate = useNavigate();
  const showSuccess = useSuccess();
  const showError = useError();

  const isEdit = Boolean(articleSlug);

  const [activeTab, setActiveTab] = useState<ArticleWorkspaceTab>(
    ARTICLE_WORKSPACE_TAB.SETTINGS,
  );

  useEffect(() => {
    if (!isEdit) {
      dispatch(setActiveSection(INFO_SETTINGS_SECTION.INFO));
    }
  }, [isEdit, dispatch]);

  const { data: article, isLoading: isArticleLoading } =
    useGetArticleAdminQuery(articleSlug!, { skip: !isEdit });

  const [createAdminArticle] = useCreateAdminArticleMutation();
  const [updateArticle] = useUpdateArticleMutation();
  const [uploadArticleImage] = useUploadArticleImageMutation();
  const [deleteAdminArticle] = useDeleteAdminArticleMutation();

  const tabs: Tab[] = useMemo(
    () => [
      {
        id: 'preview',
        label: 'Предпросмотр',
        value: ARTICLE_WORKSPACE_TAB.PREVIEW,
        disabled: !isEdit,
      },
      {
        id: 'constructor',
        label: 'Редактор',
        value: ARTICLE_WORKSPACE_TAB.CONSTRUCTOR,
        disabled: !isEdit,
      },
      {
        id: 'settings',
        label: 'Настройки',
        value: ARTICLE_WORKSPACE_TAB.SETTINGS,
      },
    ],
    [isEdit],
  );

  const handleSubmit = async (values: ArticleFormData) => {
    try {
      let targetSlug: string;

      if (isEdit && articleSlug) {
        await updateArticle({
          slug: articleSlug,
          data: {
            title: values.title,
            description: values.description,
            tags: values.tags?.map((t) => t.id) ?? [],
          },
        }).unwrap();
        targetSlug = articleSlug;
        showSuccess('Статья обновлена');
      } else {
        const created = await createAdminArticle({
          title: values.title,
          description: values.description,
          tags: values.tags?.map((t) => t.id) ?? [],
        }).unwrap();
        targetSlug = created.slug;
        showSuccess('Статья создана');
      }

      if (values.imageFile) {
        try {
          await uploadArticleImage({
            slug: targetSlug,
            file: values.imageFile,
          }).unwrap();
        } catch {
          showError('Не удалось загрузить изображение');
        }
      }

      if (!isEdit) {
        navigate({
          to: '/cabinet/articles/$articleSlug',
          params: { articleSlug: targetSlug },
        });
      }
    } catch {
      showError(isEdit ? 'Не удалось обновить статью' : 'Не удалось создать статью');
    }
  };

  const handlePublishToggle = async (nextStatus: 'published' | 'unpublished') => {
    if (!articleSlug) return;
    try {
      await updateArticle({
        slug: articleSlug,
        data: { status: nextStatus },
      }).unwrap();
      showSuccess(
        nextStatus === 'published'
          ? 'Статья опубликована'
          : 'Статья снята с публикации',
      );
    } catch {
      showError('Не удалось изменить статус статьи');
    }
  };

  const handleDelete = async () => {
    if (!articleSlug) return;
    try {
      await deleteAdminArticle(articleSlug).unwrap();
      showSuccess('Статья удалена');
      navigate({ to: ARTICLE_CABINET_LIST_PATH });
    } catch {
      showError('Не удалось удалить статью');
    }
  };

  const renderSettingsSection = (): React.ReactNode => {
    if (activeSettingsSection === INFO_SETTINGS_SECTION.INFO) {
      return (
        <ArticleCreateEditForm
          data={article ?? undefined}
          onSubmit={handleSubmit}
        />
      );
    }
    if (activeSettingsSection === INFO_SETTINGS_SECTION.ACTIONS) {
      if (!article || !articleSlug) return null;
      return (
        <InfoActionsSection
          infoType={INFO_TYPE.ARTICLE}
          initialStatus={
            article.status?.code === 'published' ? 'published' : 'unpublished'
          }
          onPublish={handlePublishToggle}
          onDelete={handleDelete}
        />
      );
    }
    return null;
  };

  if (isEdit && isArticleLoading && !article) {
    return null;
  }

  const infoTitle = isEdit ? (article?.title ?? 'Статья') : 'Создание статьи';
  const displayTitle = getInfoDisplayTitle(infoTitle, INFO_TYPE.ARTICLE);
  const isTitleTruncated = displayTitle.length > WORKSPACE_TITLE_MAX_LENGTH;
  const truncatedWorkspaceTitle = isTitleTruncated
    ? `${displayTitle.slice(0, WORKSPACE_TITLE_MAX_LENGTH).trimEnd()}`
    : displayTitle;

  const renderActiveTab = () => {
    switch (activeTab) {
      case ARTICLE_WORKSPACE_TAB.CONSTRUCTOR:
        return (
          <LessonArticleEditor
            key={articleSlug}
            articleSlug={articleSlug}
            lessonTitle={article?.title ?? 'Статья'}
            variant="embedded"
          />
        );
      case ARTICLE_WORKSPACE_TAB.PREVIEW:
        return (
          <div className={styles.previewWrap}>
            {article?.contentBlocks && article.contentBlocks.length > 0 ? (
              <ArticleContentPreview
                blocks={article.contentBlocks}
                as="article"
                className={styles.previewContent}
              />
            ) : (
              <p className={styles.previewEmpty}>
                Содержимое статьи пока не добавлено
              </p>
            )}
          </div>
        );
      case ARTICLE_WORKSPACE_TAB.SETTINGS:
      default:
        return (
          <InfoSettingsTemplate
            availableSections={
              isEdit ? undefined : [INFO_SETTINGS_SECTION.INFO]
            }
          >
            {renderSettingsSection()}
          </InfoSettingsTemplate>
        );
    }
  };

  return (
    <div className={styles.root}>
      <header className={styles.workspaceHeader}>
        <Link
          to={ARTICLE_CABINET_LIST_PATH}
          className={styles.backNav}
          aria-label="Назад"
        >
          <ArrowLeftIcon className={styles.backNavIcon} aria-hidden />
          <span className={styles.backNavLabel}>Назад</span>
        </Link>
        <h2
          className={cn([styles.workspaceTitle], {
            [styles.workspaceTitleTruncated]: isTitleTruncated,
          })}
          title={displayTitle}
        >
          {truncatedWorkspaceTitle}
        </h2>
      </header>
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(value) => setActiveTab(value as ArticleWorkspaceTab)}
        variant="secondary"
        className={styles.tabs}
      />
      <div className={styles.content}>{renderActiveTab()}</div>
    </div>
  );
};
