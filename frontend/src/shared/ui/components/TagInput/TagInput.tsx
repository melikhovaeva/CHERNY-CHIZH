import type { InfoTagRead } from '@/shared/api/generated/articles.generated';
import {
  useV1EducationTagsCreateMutation,
  useV1EducationTagsListQuery,
  type TagsListResponse,
} from '@/shared/api/tags.ts';
import { useDebouncedValue } from '@/shared/lib/hooks/useDebounce';
import { ChevronDownIcon } from '@/shared/ui/icons/ChevronDownIcon';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Tag } from '../Tag/Tag';
import styles from './TagInput.module.scss';
import {
  TAG_INPUT_DEFAULT_DEBOUNCE_MS,
  TAG_INPUT_DEFAULT_PAGE_SIZE,
  TAG_INPUT_MIN_SEARCH_LENGTH,
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
  pageSize = TAG_INPUT_DEFAULT_PAGE_SIZE,
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loadedTags, setLoadedTags] = useState<TagsListItem[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [createTags] = useV1EducationTagsCreateMutation();

  const debouncedQuery = useDebouncedValue(inputValue, debounceMs);

  useEffect(() => {
    setOffset(0);
    setLoadedTags([]);
  }, [debouncedQuery]);

  const queryParams = useMemo(
    () => ({
      q:
        debouncedQuery.length >= TAG_INPUT_MIN_SEARCH_LENGTH
          ? debouncedQuery
          : undefined,
      limit: pageSize,
      offset,
    }),
    [debouncedQuery, pageSize, offset],
  );

  const { data, isFetching, isError, refetch } = useV1EducationTagsListQuery(
    queryParams,
    {
      skip: disabled || !isDropdownOpen,
    },
  );

  const extractResults = (response?: TagsListResponse): TagsListItem[] => {
    if (!response) return [];

    if (Array.isArray(response)) {
      return response;
    }

    return response.results ?? [];
  };

  useEffect(() => {
    if (!data) return;

    setLoadedTags((prev) => {
      const nextResults = extractResults(data);

      if (offset === 0) {
        return nextResults;
      }

      const existingIds = new Set(prev.map((t) => t.id));
      const merged = [...prev];

      nextResults.forEach((tag) => {
        if (!existingIds.has(tag.id)) {
          merged.push(tag);
        }
      });

      return merged;
    });
  }, [data, offset]);

  const availableTags = useMemo(() => {
    const existingIds = new Set(value.existing.map((t) => t.id));

    return loadedTags.filter((tag) => !existingIds.has(tag.id));
  }, [loadedTags, value.existing]);

  const totalSelected = value.existing.length + value.created.length;
  const isMaxReached = typeof maxTags === 'number' && totalSelected >= maxTags;

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

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (availableTags[0]) {
        handleAddExisting(availableTags[0]);
        return;
      }

      handleAddCreated();
    }
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setIsDropdownOpen(true);
      if (availableTags.length > 0) {
        setSelectedIndex(0);
      }
    }
  };

  const handleToggleDropdown = () => {
    if (disabled) return;
    setIsDropdownOpen((prev) => {
      const next = !prev;

      if (!next) {
        setSelectedIndex(null);
      } else if (availableTags.length > 0) {
        setSelectedIndex(0);
      }

      return next;
    });
  };

  const rootClassName = [styles.root, className].filter(Boolean).join(' ');

  return (
    <div className={rootClassName} ref={containerRef}>
      {label && <span className={styles.label}>{label}</span>}
      <div
        className={[
          styles.field,
          isDropdownOpen ? styles.field_focused : '',
          disabled ? styles.field_disabled : '',
        ]
          .filter(Boolean)
          .join(' ')}
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
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled || isMaxReached}
        />
        <button
          type="button"
          className={[
            styles.dropdownToggle,
            disabled ? styles.dropdownToggle_disabled : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={handleToggleDropdown}
          aria-label="Открыть список тегов"
        >
          <ChevronDownIcon width={16} height={16} aria-hidden />
        </button>
        {isDropdownOpen && (
          <div className={styles.dropdown}>
            <div className={styles.dropdownList}>
              {isFetching && availableTags.length === 0 && (
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
                availableTags.map((tag, index) => (
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
              {!isFetching && !isError && availableTags.length === 0 && (
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
      <span className={styles.error}>{error}</span>
    </div>
  );
};
