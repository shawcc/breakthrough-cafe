/**
 * 通用类型定义文件
 * 定义整个应用的类型接口，包括语言类型、服务类型、流程步骤类型等
 */

export type Language = 'zh' | 'en';

export interface LanguageContent {
  zh: string;
  en: string;
}

export interface ServiceItem {
  id: string;
  icon: string;
  title: LanguageContent;
  description: LanguageContent;
  link: string;
  buttonText: LanguageContent;
}

export interface ProcessStep {
  number: number;
  title: LanguageContent;
  description: LanguageContent;
}

export interface NavigationItem {
  href: string;
  text: LanguageContent;
}
