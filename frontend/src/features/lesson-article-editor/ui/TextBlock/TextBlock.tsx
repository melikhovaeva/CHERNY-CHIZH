import type { TextBlock as TextBlockModel } from '@/entities/article';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import AlignLeftIcon from '../../assets/align-left.svg?react';
import AlignMiddleIcon from '../../assets/align-middle.svg?react';
import AlignRightIcon from '../../assets/align-right.svg?react';
import BoldIcon from '../../assets/bold.svg?react';
import ItalicIcon from '../../assets/italic.svg?react';
import LinkIcon from '../../assets/link.svg?react';
import OrderedListIcon from '../../assets/ordered-list.svg?react';
import StrokedIcon from '../../assets/stroked.svg?react';
import UnderlineIcon from '../../assets/underline.svg?react';
import UnorderedListIcon from '../../assets/unordered-list.svg?react';
import {
  TEXT_BLOCK_DEBOUNCE_MS,
  TEXT_BLOCK_DEFAULT_FORE_COLOR,
  TEXT_BLOCK_FONT_SIZE_OPTIONS,
  TEXT_BLOCK_FORMAT_OPTIONS,
  TEXT_BLOCK_TOOLBAR,
} from '../../config';
import styles from './TextBlock.module.scss';

export interface TextBlockProps {
  block: TextBlockModel;
  isEditing: boolean;
  onFocus: () => void;
  onChange: (html: string) => void;
  onBlurEditing: () => void;
}

function normalizeFormatBlock(raw: string): string {
  const t = raw.replace(/[<>]/g, '').toLowerCase();
  if (t === 'normal' || t === 'div') return 'p';
  if (t === 'h2' || t === 'h3') return t;
  return 'p';
}

function normalizeFontSize(raw: string): '2' | '3' | '5' {
  const s = String(raw);
  if (s === '2' || s === '3' || s === '5') return s;
  return '3';
}

export function TextBlock({
  block,
  isEditing,
  onFocus,
  onChange,
  onBlurEditing,
}: TextBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<number | null>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const lastHtmlRef = useRef('');
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [formatBlock, setFormatBlock] = useState('p');
  const [fontSize, setFontSize] = useState<'2' | '3' | '5'>('3');
  const [foreColor, setForeColor] = useState(TEXT_BLOCK_DEFAULT_FORE_COLOR);

  /* При каждом входе в режим редактирования или смене блока подставляем html из props.
     block.html намеренно не в deps — иначе перезапись DOM на каждый onChange. */
  useLayoutEffect(() => {
    if (!isEditing) return;
    const el = ref.current;
    if (!el) return;
    const html =
      block.html && block.html.trim() ? block.html : '<p><br></p>';
    el.innerHTML = html;
    lastHtmlRef.current = html;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- см. комментарий выше
  }, [isEditing, block.id]);

  useEffect(() => {
    return () => {
      if (debounceRef.current !== null) {
        window.clearTimeout(debounceRef.current);
      }
      if (lastHtmlRef.current) {
        onChangeRef.current(lastHtmlRef.current);
      }
    };
  }, []);

  const flushChange = useCallback(() => {
    if (!ref.current) return;
    const html = ref.current.innerHTML;
    lastHtmlRef.current = html;
    onChange(html);
  }, [onChange]);

  const scheduleChange = useCallback(() => {
    if (debounceRef.current !== null) {
      window.clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      debounceRef.current = null;
      flushChange();
    }, TEXT_BLOCK_DEBOUNCE_MS);
  }, [flushChange]);

  const setStyleWithCss = useCallback((on: boolean) => {
    try {
      document.execCommand('styleWithCSS', false, on ? 'true' : 'false');
    } catch {
      /* ignore */
    }
  }, []);

  const execRich = useCallback(
    (command: string, value?: string) => {
      ref.current?.focus();
      setStyleWithCss(true);
      document.execCommand(command, false, value);
      flushChange();
    },
    [flushChange, setStyleWithCss],
  );

  const ensureParagraphDefaults = useCallback(() => {
    try {
      document.execCommand('defaultParagraphSeparator', false, 'p');
    } catch {
      /* ignore */
    }
  }, []);

  const insertList = useCallback(
    (ordered: boolean) => {
      const el = ref.current;
      if (!el) return;
      el.focus();
      ensureParagraphDefaults();
      setStyleWithCss(false);

      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;

      const range = sel.getRangeAt(0);
      const cmd = ordered ? 'insertOrderedList' : 'insertUnorderedList';

      if (!range.collapsed) {
        document.execCommand(cmd, false);
        flushChange();
        return;
      }

      let node: Node | null = range.startContainer;
      if (node.nodeType === Node.TEXT_NODE) {
        node = node.parentNode;
      }

      const blockEl =
        node instanceof Element
          ? node.closest('p, h1, h2, h3, h4, li, div')
          : null;

      const isDirectBlock =
        blockEl &&
        blockEl.parentNode === el &&
        (blockEl.tagName === 'P' ||
          blockEl.tagName === 'H1' ||
          blockEl.tagName === 'H2' ||
          blockEl.tagName === 'H3' ||
          blockEl.tagName === 'H4');

      if (isDirectBlock) {
        const raw = blockEl.innerHTML.replace(/\s/g, '');
        const isEmpty =
          !blockEl.textContent?.trim() || raw === '<br>' || raw === '';

        if (isEmpty) {
          const tag = ordered ? 'ol' : 'ul';
          blockEl.outerHTML = `<${tag}><li><br></li></${tag}>`;
          const newList = el.querySelector(`${tag}:last-of-type`);
          const firstLi = newList?.querySelector('li');
          if (firstLi) {
            const r = document.createRange();
            r.selectNodeContents(firstLi);
            r.collapse(true);
            sel.removeAllRanges();
            sel.addRange(r);
          }
          flushChange();
          return;
        }

        const wrap = document.createRange();
        wrap.selectNodeContents(blockEl);
        sel.removeAllRanges();
        sel.addRange(wrap);
      }

      document.execCommand(cmd, false);
      flushChange();
    },
    [flushChange, ensureParagraphDefaults, setStyleWithCss],
  );

  const resetStyles = useCallback(() => {
    ref.current?.focus();
    setStyleWithCss(false);
    document.execCommand('removeFormat', false);
    document.execCommand('formatBlock', false, 'p');
    setFormatBlock('p');
    setFontSize('3');
    setForeColor(TEXT_BLOCK_DEFAULT_FORE_COLOR);
    flushChange();
  }, [flushChange, setStyleWithCss]);

  const syncToolbarFromSelection = useCallback(() => {
    const root = ref.current;
    if (!root) return;
    const sel = document.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    if (!sel.anchorNode || !root.contains(sel.anchorNode)) return;

    try {
      const fmt = document.queryCommandValue('formatBlock');
      if (fmt) {
        setFormatBlock(normalizeFormatBlock(fmt));
      }
      const fs = document.queryCommandValue('fontSize');
      if (fs) {
        setFontSize(normalizeFontSize(fs));
      }
    } catch {
      /* queryCommand* не везде доступны */
    }
  }, []);

  useEffect(() => {
    if (!isEditing) return;
    ensureParagraphDefaults();
    setStyleWithCss(true);
  }, [isEditing, ensureParagraphDefaults, setStyleWithCss]);

  useEffect(() => {
    if (!isEditing) return;
    const root = ref.current;
    if (!root) return;

    const onSel = () => {
      requestAnimationFrame(syncToolbarFromSelection);
    };

    document.addEventListener('selectionchange', onSel);
    root.addEventListener('keyup', onSel);
    root.addEventListener('mouseup', onSel);
    return () => {
      document.removeEventListener('selectionchange', onSel);
      root.removeEventListener('keyup', onSel);
      root.removeEventListener('mouseup', onSel);
    };
  }, [isEditing, syncToolbarFromSelection]);

  const addLink = useCallback(() => {
    ref.current?.focus();
    setStyleWithCss(true);
    const raw = window.prompt(
      TEXT_BLOCK_TOOLBAR.LINK_PROMPT,
      'https://',
    );
    if (raw === null) return;
    const trimmed = raw.trim();
    if (trimmed === '') {
      document.execCommand('unlink', false);
    } else {
      const href = /^https?:\/\//i.test(trimmed)
        ? trimmed
        : `https://${trimmed}`;
      document.execCommand('createLink', false, href);
    }
    flushChange();
  }, [flushChange, setStyleWithCss]);

  const applyForeColor = useCallback(
    (hex: string) => {
      setForeColor(hex);
      ref.current?.focus();
      setStyleWithCss(true);
      document.execCommand('foreColor', false, hex);
      flushChange();
    },
    [flushChange, setStyleWithCss],
  );

  const onFormatChange = useCallback(
    (value: string) => {
      setFormatBlock(value);
      ref.current?.focus();
      setStyleWithCss(true);
      document.execCommand('formatBlock', false, value);
      flushChange();
    },
    [flushChange, setStyleWithCss],
  );

  const onFontSizeChange = useCallback(
    (value: '2' | '3' | '5') => {
      setFontSize(value);
      ref.current?.focus();
      setStyleWithCss(true);
      document.execCommand('fontSize', false, value);
      flushChange();
    },
    [flushChange, setStyleWithCss],
  );

  const handleToolbarMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const t = e.target as HTMLElement;
      if (t.closest('select')) return;
      e.preventDefault();
    },
    [],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      ref.current?.blur();
      onBlurEditing();
    }
  };

  if (!isEditing) {
    return (
      <div
        className={styles.readonly}
        dangerouslySetInnerHTML={{ __html: block.html || '' }}
      />
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.editorShell}>
        <div
          className={styles.toolbar}
          onMouseDown={handleToolbarMouseDown}
        >
          <div className={styles.toolbarGroup}>
            <button
              type="button"
              className={styles.toolIconBtn}
              onClick={() => execRich('bold')}
              aria-label="Жирный"
              title="Жирный"
            >
              <BoldIcon className={styles.toolbarIcon} aria-hidden />
            </button>
            <button
              type="button"
              className={styles.toolIconBtn}
              onClick={() => execRich('italic')}
              aria-label="Курсив"
              title="Курсив"
            >
              <ItalicIcon className={styles.toolbarIcon} aria-hidden />
            </button>
            <button
              type="button"
              className={styles.toolIconBtn}
              onClick={() => execRich('underline')}
              aria-label="Подчёркивание"
              title="Подчёркивание"
            >
              <UnderlineIcon className={styles.toolbarIcon} aria-hidden />
            </button>
            <button
              type="button"
              className={styles.toolIconBtn}
              onClick={() => execRich('strikeThrough')}
              aria-label="Зачёркивание"
              title="Зачёркивание"
            >
              <StrokedIcon className={styles.toolbarIcon} aria-hidden />
            </button>
          </div>

          <span className={styles.toolbarDivider} aria-hidden />

          <div className={styles.toolbarGroup}>
            <button
              type="button"
              className={styles.colorTrigger}
              title={TEXT_BLOCK_TOOLBAR.COLOR_TITLE}
              aria-label={TEXT_BLOCK_TOOLBAR.COLOR_TITLE}
              onClick={() => colorInputRef.current?.click()}
            >
              <span
                className={styles.colorDot}
                style={{ backgroundColor: foreColor }}
              />
            </button>
            <input
              ref={colorInputRef}
              type="color"
              className={styles.colorInputHidden}
              value={foreColor}
              onChange={(e) => applyForeColor(e.target.value)}
              tabIndex={-1}
              aria-hidden
            />
          </div>

          <span className={styles.toolbarDivider} aria-hidden />

          <div className={styles.toolbarGroup}>
            <button
              type="button"
              className={styles.toolIconBtn}
              onClick={() => execRich('justifyLeft')}
              aria-label="По левому краю"
              title="По левому краю"
            >
              <AlignLeftIcon className={styles.toolbarIcon} aria-hidden />
            </button>
            <button
              type="button"
              className={styles.toolIconBtn}
              onClick={() => execRich('justifyCenter')}
              aria-label="По центру"
              title="По центру"
            >
              <AlignMiddleIcon className={styles.toolbarIcon} aria-hidden />
            </button>
            <button
              type="button"
              className={styles.toolIconBtn}
              onClick={() => execRich('justifyRight')}
              aria-label="По правому краю"
              title="По правому краю"
            >
              <AlignRightIcon className={styles.toolbarIcon} aria-hidden />
            </button>
          </div>

          <span className={styles.toolbarDivider} aria-hidden />

          <div className={styles.toolbarGroup}>
            <button
              type="button"
              className={styles.toolIconBtn}
              onClick={() => insertList(true)}
              aria-label="Нумерованный список"
              title="Нумерованный список"
            >
              <OrderedListIcon className={styles.toolbarIcon} aria-hidden />
            </button>
            <button
              type="button"
              className={styles.toolIconBtn}
              onClick={() => insertList(false)}
              aria-label="Маркированный список"
              title="Маркированный список"
            >
              <UnorderedListIcon
                className={styles.toolbarIcon}
                aria-hidden
              />
            </button>
          </div>

          <span className={styles.toolbarDivider} aria-hidden />

          <div className={styles.toolbarGroup}>
            <select
              className={styles.toolbarSelect}
              value={formatBlock}
              onChange={(e) => onFormatChange(e.target.value)}
              aria-label="Стиль абзаца"
            >
              {TEXT_BLOCK_FORMAT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <select
              className={styles.toolbarSelect}
              value={fontSize}
              onChange={(e) =>
                onFontSizeChange(normalizeFontSize(e.target.value))
              }
              aria-label="Размер шрифта"
            >
              {TEXT_BLOCK_FONT_SIZE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <span className={styles.toolbarDivider} aria-hidden />

          <div className={styles.toolbarGroup}>
            <button
              type="button"
              className={styles.toolIconBtn}
              onClick={addLink}
              aria-label={TEXT_BLOCK_TOOLBAR.LINK_TITLE}
              title={TEXT_BLOCK_TOOLBAR.LINK_TITLE}
            >
              <LinkIcon className={styles.toolbarIconLink} aria-hidden />
            </button>
            <button
              type="button"
              className={styles.toolBtnText}
              onClick={resetStyles}
              title={TEXT_BLOCK_TOOLBAR.RESET_TITLE}
            >
              {TEXT_BLOCK_TOOLBAR.RESET_LABEL}
            </button>
          </div>
        </div>

        <div
          ref={ref}
          role="textbox"
          tabIndex={0}
          className={styles.editable}
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Введите текст…"
          onFocus={onFocus}
          onInput={scheduleChange}
          onBlur={flushChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
