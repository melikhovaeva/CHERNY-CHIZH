export interface DictionaryGroupSummary {
  id: number;
  name: string;
}

export type DictionariesIndex = Record<string, DictionaryGroupSummary>;

export interface DictionaryItem {
  code: string;
  label: string;
}

export interface DictionaryMeta {
  id: number;
  name: string;
  key: string;
  verboseName: string;
  items: DictionaryItem[];
}

export interface DictionaryGroup {
  id: number;
  name: string;
  verboseName: string;
  dictionaries: Record<string, DictionaryMeta>;
}
