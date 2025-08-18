/**
 * 网站内容数据
 * 集中管理所有页面的文本内容，支持多语言
 */

import type { ServiceItem, ProcessStep, NavigationItem } from '../types';

export const navigationItems: NavigationItem[] = [
  {
    href: '/programming',
    text: { zh: '编程辅助', en: 'Programming Assistance' }
  },
  {
    href: '/cases',
    text: { zh: '看看他们', en: 'Case Studies' }
  },
  {
    href: '/about',
    text: { zh: '关于我们', en: 'About Us' }
  }
];

export const services: ServiceItem[] = [
  {
    id: 'tech-support',
    icon: '',
    title: { zh: 'AI编程辅助', en: 'AI Programming Support' },
    description: {
      zh: '遭遇鬼打墙，怎么都调不通？AI突然降智，气得想砸电脑？Demo有了，部署又卡住了？找真人解决吧，一杯咖啡的价格',
      en: 'Hitting a wall and can\'t debug anything? AI suddenly acting dumb, making you want to smash your computer? Got a demo but stuck on deployment? Find a real person to solve it, for the price of a cup of coffee'
    },
    link: 'https://fiverr.com/gig-tech-support',
    buttonText: { zh: '获取帮助', en: 'Get Help' }
  },
  {
    id: 'marketing',
    icon: '🎁',
    title: { zh: '产品运营', en: 'Product Operations' },
    description: {
      zh: '如何找到第一批用户？如何构建飞轮？和我们聊聊，说不定会有启发',
      en: 'How to find your first users? How to build a flywheel? Let\'s chat, you might get some inspiration'
    },
    link: 'https://fiverr.com/gig-marketing',
    buttonText: { zh: '欢迎来聊', en: 'Let\'s Chat' }
  },
  {
    id: 'consulting',
    icon: '🎁',
    title: { zh: '商业化设计', en: 'Commercialization Design' },
    description: {
      zh: '如何赚取第一桶金？如何构建护城河？和我们聊聊，说不定会有启发',
      en: 'How to earn your first pot of gold? How to build a moat? Let\'s chat, you might get some inspiration'
    },
    link: 'https://fiverr.com/gig-consulting',
    buttonText: { zh: '欢迎来聊', en: 'Let\'s Chat' }
  },
  {
    id: 'networking',
    icon: '🎁',
    title: { zh: '资源对接', en: 'Resource Networking' },
    description: {
      zh: '如何找到事业伙伴？如何找到更多外部力量？和我们聊聊，说不定会有启发',
      en: 'How to find business partners? How to find more external forces? Let\'s chat, you might get some inspiration'
    },
    link: 'https://fiverr.com/gig-networking',
    buttonText: { zh: '欢迎来聊', en: 'Let\'s Chat' }
  }
];

export const processSteps: ProcessStep[] = [
  {
    number: 1,
    title: { zh: '认真撰写PRD', en: 'Write a Detailed PRD' },
    description: {
      zh: 'PRD比对话更适合AI，清晰的PRD能帮助AI全面了解你的诉求。如果没有PRD，不建议直接编程',
      en: 'PRDs work better with AI than conversations. A clear PRD helps AI fully understand your requirements. Direct programming without a PRD is not recommended'
    }
  },
  {
    number: 2,
    title: { zh: '别和AI死磕', en: 'Don\'t Keep Fighting with AI' },
    description: {
      zh: 'AI让你生气的时候，你俩已经不在一个频道了，找专业的人寻求帮助，他会告诉你如何下一步',
      en: 'When AI makes you angry, you\'re no longer on the same wavelength. Find a professional for help, who will tell you what to do next'
    }
  },
  {
    number: 3,
    title: { zh: '用尽心力培育它', en: 'Nurture It with All Your Heart' },
    description: {
      zh: '它不是玩具，是用来让世界变更好的产品。请用尽心力去实现你最开始的设想',
      en: 'It\'s not a toy, but a product meant to make the world better. Please put all your effort into realizing your original vision'
    }
  }
];