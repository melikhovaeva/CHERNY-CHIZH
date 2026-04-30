import { useAppSelector } from '@/app/store';
import {
  useGetArticlesListQuery,
  useListAdminArticlesQuery,
  type ArticleAdminListItem,
  type ArticleListItem,
} from '@/entities/article';
import { selectIsAdmin } from '@/entities/session';
import { Button } from '@/shared';
import { SearchInput } from '@/shared/ui';
import { EditIcon } from '@/shared/ui/assets';
import { ArticleCard } from '@/widgets/knowledge-base/ArticleCard/ArticleCard';
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import styles from './CabinetArticles.module.scss';

function adminToListItem(item: ArticleAdminListItem): ArticleListItem {
  return item as unknown as ArticleListItem;
}

function matchesSearch(title: string, description: string, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return title.toLowerCase().includes(q) || description.toLowerCase().includes(q);
}

export function CabinetArticles() {
  const isAdmin = useAppSelector(selectIsAdmin);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: adminArticles, isLoading: isAdminLoading } =
    useListAdminArticlesQuery(undefined, { skip: !isAdmin });

  const { data: publicData, isLoading: isPublicLoading } =
    useGetArticlesListQuery(undefined, { skip: isAdmin });

  const filteredAdmin = useMemo(
    () =>
      (adminArticles ?? []).filter((item) =>
        matchesSearch(item.title, item.description ?? '', searchQuery),
      ),
    [adminArticles, searchQuery],
  );

  const filteredPublic = useMemo(
    () =>
      ((publicData?.results ?? []) as ArticleListItem[]).filter((item) =>
        matchesSearch(item.title ?? '', (item as { description?: string }).description ?? '', searchQuery),
      ),
    [publicData, searchQuery],
  );

  const isNestedRoute =
    location.pathname.startsWith('/cabinet/articles/') &&
    location.pathname !== '/cabinet/articles';

  if (isNestedRoute) {
    return <Outlet />;
  }

  const isLoading = isAdmin ? isAdminLoading : isPublicLoading;
  const filtered = isAdmin ? filteredAdmin : filteredPublic;
  const isEmpty = !isLoading && filtered.length === 0;

  return (
    <div className={styles.root}>
      <div className={styles.controls}>
        <div className={styles.searchRow}>
          <SearchInput
            value={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="Поиск по статьям"
            ariaLabel="Поиск по статьям"
          />
        </div>
        {isAdmin && (
          <Button
            variant="crm"
            className={styles.createButton}
            onClick={() => navigate({ to: '/cabinet/articles/new' })}
          >
            Создать статью
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className={styles.empty}>Загружаем статьи…</div>
      ) : isEmpty ? (
        <div className={styles.empty}>
          {searchQuery ? 'Ничего не найдено' : 'Статей пока нет'}
        </div>
      ) : (
        <div className={styles.list}>
          {isAdmin
            ? filteredAdmin.map((item) => (
                <div key={item.id} className={styles.cardWrapper}>
                  <ArticleCard article={adminToListItem(item)} status={item.status} />
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
              ))
            : filteredPublic.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
        </div>
      )}
    </div>
  );
}
