import type { InfoTagRead } from '@/shared/api/generated/articles.generated';
import {
  useLazyV1EducationTagsListQuery,
  useV1EducationTagsCreateMutation,
  useV1EducationTagsListQuery,
  type TagsListResponse,
} from '@/shared/api/tags.ts';
import { useDebouncedValue } from '@/shared/lib/hooks/useDebounce';
import { ChevronDownIcon } from '@/shared/ui/icons/ChevronDownIcon';
import { FieldLayout, useDropdownState } from '@/shared/ui/components/AbstractField';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Tag } from '../Tag/Tag';
import styles from './TagInput.module.scss';
import {
  TAG_INPUT_DEFAULT_DEBOUNCE_MS,
  TAG_INPUT_INITIAL_PAGE_SIZE,
  TAG_INPUT_LOAD_MORE_PAGE_SIZE,
  TAG_INPUT_MIN_SEARCH_LENGTH,
  TAG_INPUT_VISIBLE_ITEMS,
} from './config';

export type TagInputValue = {
  existing: InfoTagRead[];
  created: string[];
};

export interface TagInputProps {
  value: TagInputValue;
  onChange: (value: TagInputValue) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  maxTags?: number;
  debounceMs?: number;
  pageSize?: number;
}

type TagsListItem = InfoTagRead;

export const TagInput = ({
  value,
  onChange,
  label,
  placeholder,
  disabled,
  error,
  className,
  maxTags,
  debounceMs = TAG_INPUT_DEFAULT_DEBOUNCE_MS,
  pageSize,
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const dropdown = useDropdownState(disabled);
  const [hasMore, setHasMore] = useState(true);
  const [nextOffset, setNextOffset] = useState(0);
  const [selectionsFromDropdown, setSelectionsFromDropdown] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loadedTags, setLoadedTags] = useState<TagsListItem[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [createTags] = useV1EducationTagsCreateMutation();

  const debouncedQuery = useDebouncedValue(inputValue, debounceMs);

  const initialQueryParams = useMemo(
    () => ({
      q:
        debouncedQuery.length >= TAG_INPUT_MIN_SEARCH_LENGTH
          ? debouncedQuery
          : undefined,
      limit: pageSize ?? TAG_INPUT_INITIAL_PAGE_SIZE,
      offset: 0,
    }),
    [debouncedQuery, pageSize],
  );

  const { data, isFetching, isError, refetch } = useV1EducationTagsListQuery(
    initialQueryParams,
    {
      skip: disabled || !dropdown.isOpen,
    },
  );

  const [fetchNextPage, { isFetching: isLoadMoreFetching }] =
    useLazyV1EducationTagsListQuery();

  const extractResults = (response?: TagsListResponse): TagsListItem[] => {
    if (!response) return [];

    if (Array.isArray(response)) {
      return response;
    }

    return response.results ?? [];
  };

  useEffect(() => {
    if (!data) return;

    const nextResults = extractResults(data);
    const limitUsed = pageSize ?? TAG_INPUT_INITIAL_PAGE_SIZE;

    setLoadedTags(nextResults);
    setHasMore(nextResults.length === limitUsed);
    setNextOffset(nextResults.length);
  }, [data, pageSize]);

  const availableTags = useMemo(() => {
    const existingIds = new Set(value.existing.map((t) => t.id));

    return loadedTags.filter((tag) => !existingIds.has(tag.id));
  }, [loadedTags, value.existing]);

  const visibleTags = useMemo(
    () => availableTags.slice(0, TAG_INPUT_VISIBLE_ITEMS),
    [availableTags],
  );

  const totalSelected = value.existing.length + value.created.length;
  const isMaxReached = typeof maxTags === 'number' && totalSelected >= maxTags;

  const handleClose = () => {
    setSelectedIndex(null);
    dropdown.close();
  };

  const handleOpen = () => {
    if (disabled) return;
    dropdown.open();
    if (availableTags.length > 0) {
      setSelectedIndex(0);
    }
  };

  const handleChangeValue = (next: TagInputValue) => {
    if (
      isMaxReached &&
      next.existing.length + next.created.length > totalSelected
    )
      return;
    onChange(next);
  };

  const handleAddExisting = (tag: InfoTagRead) => {
    if (value.existing.some((t) => t.id === tag.id)) return;
    handleChangeValue({
      existing: [...value.existing, tag],
      created: value.created,
    });
    setInputValue('');
    setSelectedIndex(null);

    const nextSelections = selectionsFromDropdown + 1;
    setSelectionsFromDropdown(nextSelections);
    if (
      nextSelections >= TAG_INPUT_VISIBLE_ITEMS &&
      hasMore &&
      !isLoadMoreFetching
    ) {
      setSelectionsFromDropdown(0);
      fetchNextPage({
        q:
          debouncedQuery.length >= TAG_INPUT_MIN_SEARCH_LENGTH
            ? debouncedQuery
            : undefined,
        limit: TAG_INPUT_LOAD_MORE_PAGE_SIZE,
        offset: nextOffset,
      })
        .unwrap()
        .then((response) => {
          const nextResults = extractResults(response);
          setLoadedTags((prev) => {
            const existingIds = new Set(prev.map((t) => t.id));
            const merged = [...prev];
            nextResults.forEach((tag) => {
              if (!existingIds.has(tag.id)) merged.push(tag);
            });
            return merged;
          });
          setHasMore(nextResults.length === TAG_INPUT_LOAD_MORE_PAGE_SIZE);
          setNextOffset((prev) => prev + nextResults.length);
        })
        .catch(() => {});
    }
  };

  const handleAddCreated = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (value.created.includes(trimmed)) return;

    handleChangeValue({
      existing: value.existing,
      created: [...value.created, trimmed],
    });
    createTags([{ code: trimmed, label: trimmed }]).catch(() => undefined);
    setInputValue('');
  };

  const handleRemoveExisting = (tag: InfoTagRead) => {
    handleChangeValue({
      existing: value.existing.filter((t) => t.id !== tag.id),
      created: value.created,
    });
  };

  const handleRemoveCreated = (labelToRemove: string) => {
    handleChangeValue({
      existing: value.existing,
      created: value.created.filter((label) => label !== labelToRemove),
    });
  };

  const handleFieldMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || isMaxReached) return;

    const target = event.target as HTMLElement;
    const tagName = target.tagName.toLowerCase();

    if (tagName === 'input' || tagName === 'button') {
      return;
    }

    event.preventDefault();
    inputRef.current?.focus();
  };

  const handleRemoveLastTag = () => {
    if (value.created.length > 0) {
      const nextCreated = value.created.slice(0, -1);
      handleChangeValue({
        existing: value.existing,
        created: nextCreated,
      });
      return;
    }

    if (value.existing.length > 0) {
      const nextExisting = value.existing.slice(0, -1);
      handleChangeValue({
        existing: nextExisting,
        created: value.created,
      });
    }
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && inputValue === '') {
      handleRemoveLastTag();
    }

    if (event.key === 'Escape' && dropdown.isOpen && !dropdown.isClosing) {
      event.preventDefault();
      handleClose();
      inputRef.current?.blur();
      return;
    }

    if (event.key === 'ArrowDown' && dropdown.isOpen && !dropdown.isClosing) {
      event.preventDefault();
      setSelectedIndex((prevIndex) => {
        if (visibleTags.length === 0) return null;

        if (
          prevIndex === null ||
          prevIndex < 0 ||
          prevIndex >= visibleTags.length
        ) {
          return 0;
        }

        if (prevIndex < visibleTags.length - 1) {
          return prevIndex + 1;
        }

        return prevIndex;
      });
      return;
    }

    if (event.key === 'ArrowUp' && dropdown.isOpen && !dropdown.isClosing) {
      event.preventDefault();
      setSelectedIndex((prevIndex) => {
        if (visibleTags.length === 0) return null;

        if (
          prevIndex === null ||
          prevIndex <= 0 ||
          prevIndex >= visibleTags.length
        ) {
          return 0;
        }

        return prevIndex - 1;
      });
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      if (
        dropdown.isOpen &&
        !dropdown.isClosing &&
        selectedIndex !== null &&
        visibleTags[selectedIndex]
      ) {
        handleAddExisting(visibleTags[selectedIndex]);
        return;
      }

      handleAddCreated();
    }
  };

  const handleInputFocus = () => {
    handleOpen();
  };

  useEffect(() => {
    if (!dropdown.isOpen || dropdown.isClosing) {
      return;
    }

    if (visibleTags.length === 0) {
      setSelectedIndex(null);
      return;
    }

    setSelectedIndex((prevIndex) => {
      if (
        prevIndex === null ||
        prevIndex < 0 ||
        prevIndex >= visibleTags.length
      ) {
        return 0;
      }

      return prevIndex;
    });
  }, [dropdown.isOpen, dropdown.isClosing, visibleTags]);

  const rootClassName = [styles.root, className].filter(Boolean).join(' ');

  return (
    <FieldLayout label={label} error={error} className={rootClassName}>
      <div
        ref={dropdown.containerRef as React.RefObject<HTMLDivElement>}
        className={[
          styles.field,
          dropdown.isOpen ? styles.field_focused : '',
          disabled ? styles.field_disabled : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onMouseDown={handleFieldMouseDown}
      >
        <div className={styles.tags}>
          {value.existing.map((tag) => (
            <Tag
              key={tag.id}
              tag={tag}
              removable
              onRemove={handleRemoveExisting}
            />
          ))}
          {value.created.map((labelValue) => (
            <Tag
              key={labelValue}
              tag={{ id: 0, code: labelValue, label: labelValue }}
              removable
              onRemove={() => handleRemoveCreated(labelValue)}
            />
          ))}
        </div>
        <input
          className={[styles.input, disabled ? styles.input_disabled : '']
            .filter(Boolean)
            .join(' ')}
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled || isMaxReached}
        />
        <div
          className={[
            styles.dropdownToggle,
            dropdown.isOpen ? styles.dropdownToggle_open : '',
            disabled ? styles.dropdownToggle_disabled : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <ChevronDownIcon width={16} height={16} aria-hidden />
        </div>
        {(dropdown.isOpen || dropdown.isClosing) && (
          <div className={styles.dropdown}>
            <div
              ref={dropdown.listRef as React.RefObject<HTMLDivElement>}
              className={[
                styles.dropdownList,
                dropdown.isListVisible && !dropdown.isClosing
                  ? styles.dropdownList_visible
                  : '',
                dropdown.isClosing ? styles.dropdownList_closing : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onTransitionEnd={dropdown.handleListTransitionEnd}
            >
              {isFetching && visibleTags.length === 0 && (
                <button
                  type="button"
                  className={[styles.dropdownItem, styles.dropdownItem_disabled]
                    .filter(Boolean)
                    .join(' ')}
                >
                  Загрузка тегов...
                </button>
              )}
              {isError && (
                <button
                  type="button"
                  className={styles.dropdownItem}
                  onClick={() => refetch()}
                >
                  Не удалось загрузить теги, повторить попытку
                </button>
              )}
              {!isFetching &&
                !isError &&
                visibleTags.map((tag, index) => (
                  <button
                    key={tag.id}
                    type="button"
                    className={[
                      styles.dropdownItem,
                      selectedIndex === index ? styles.dropdownItem_active : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => handleAddExisting(tag)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    {tag.label}
                  </button>
                ))}
              {!isFetching && !isError && visibleTags.length === 0 && (
                <button
                  type="button"
                  className={[styles.dropdownItem, styles.dropdownItem_disabled]
                    .filter(Boolean)
                    .join(' ')}
                >
                  Теги не найдены
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </FieldLayout>
  );
};
