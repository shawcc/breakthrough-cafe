/**
 * 语言状态管理
 * 使用jotai管理全局语言状态，支持中英文切换
 */

import { atom } from 'jotai';
import type { Language } from '../types';

export const languageAtom = atom<Language>('zh');

export const useLanguageContent = (content: { zh: string; en: string }, currentLang: Language) => {
  return content[currentLang];
};
