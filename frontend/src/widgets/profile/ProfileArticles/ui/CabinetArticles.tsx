import { useAppSelector } from '@/app/store';
import {
  useGetArticlesListQuery,
  useListAdminArticlesQuery,
  type ArticleAdminListItem,
  type ArticleListItem,
} from '@/entities/article';
import { selectIsAdmin } from '@/entities/session';
import { Button } from '@/shared';
import { EditIcon } from '@/shared/ui/assets';
import { ArticleCard } from '@/widgets/knowledge-base/ArticleCard/ArticleCard';
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import styles from './CabinetArticles.module.scss';

function adminToListItem(item: ArticleAdminListItem): ArticleListItem {
  return item as unknown as ArticleListItem;
}

export function CabinetArticles() {
  const isAdmin = useAppSelector(selectIsAdmin);
  const navigate = useNavigate();
  const location = useLocation();

  const { data: adminArticles, isLoading: isAdminLoading } =
    useListAdminArticlesQuery(undefined, { skip: !isAdmin });

  const { data: publicData, isLoading: isPublicLoading } =
    useGetArticlesListQuery(undefined, { skip: isAdmin });

  const isNestedRoute =
    location.pathname.startsWith('/cabinet/articles/') &&
    location.pathname !== '/cabinet/articles';

  if (isNestedRoute) {
    return <Outlet />;
  }

  if (isAdmin) {
    return (
      <div className={styles.root}>
        <div className={styles.controls}>
          <Button
            variant="crm"
            onClick={() => navigate({ to: '/cabinet/articles/new' })}
          >
            Создать статью
          </Button>
        </div>
        {isAdminLoading ? (
          <div className={styles.loading}>Загружаем статьи…</div>
        ) : adminArticles && adminArticles.length > 0 ? (
          <div className={styles.list}>
            {adminArticles.map((item) => (
              <div key={item.id} className={styles.cardWrapper}>
                <ArticleCard article={adminToListItem(item)} />
                <Button
                  type="button"
                  variant="crm"
                  className={styles.editButton}
                  onClick={() =>
                    navigate({
                      to: '/cabinet/articles/$articleSlug',
                      params: { articleSlug: item.slug },
                    })
                  }
                  aria-label="Редактировать статью"
                >
                  <EditIcon aria-hidden />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>Статей пока нет</div>
        )}
      </div>
    );
  }

  const articles: ArticleListItem[] = (publicData?.results ?? []) as ArticleListItem[];

  return (
    <div className={styles.root}>
      {isPublicLoading ? (
        <div className={styles.loading}>Загружаем статьи…</div>
      ) : articles.length > 0 ? (
        <div className={styles.list}>
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>Статей пока нет</div>
      )}
    </div>
  );
}
