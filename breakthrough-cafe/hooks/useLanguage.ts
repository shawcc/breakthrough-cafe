/**
 * 语言切换Hook
 * 提供语言切换功能和内容获取方法
 */

import { useAtom } from 'jotai';
import { languageAtom } from '../store/languageStore';
import type { Language, LanguageContent } from '../types';

export const useLanguage = () => {
  const [currentLang, setCurrentLang] = useAtom(languageAtom);

  const switchLanguage = (lang: Language) => {
    setCurrentLang(lang);
  };

  const getContent = (content: LanguageContent) => {
    return content[currentLang];
  };

  return {
    currentLang,
    switchLanguage,
    getContent
  };
};
