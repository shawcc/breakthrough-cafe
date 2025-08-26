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
    text: { zh: '成功案例', en: 'Success Cases' }
  },
  {
    href: '/articles',
    text: { zh: '经验方法', en: 'Best Practices' }
  }
];

export const services: ServiceItem[] = [
  {
    id: 'tech-support',
    icon: '',
    title: { zh: 'AI编程辅助', en: 'AI Programming Support' },
    description: {
      zh: '遭遇鬼打墙，怎么都调不通？AI突然降智，气到想砸电脑？快去请人类朋友，只要一杯咖啡钱，只用一杯咖啡的时间',
      en: 'Hitting a wall and can\'t debug anything? AI suddenly acting dumb, making you angry? Get a human friend to help - just the price of a cup of coffee, just the time it takes to drink one'
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
      zh: 'AI让你生气的时候，你俩已经不在一个频道了，找人类朋友寻求帮助，他会解开你们之间的疙瘩',
      en: 'When AI makes you angry, you\'re no longer on the same wavelength. Find a human friend for help, who will untangle the knot between you two'
    }
  },
  {
    number: 3,
    title: { zh: '用尽心力培育它', en: 'Nurture It with All Your Heart' },
    description: {
      zh: '做了不等于做好，没做好的产品不会带来指数级的增长，精益求精，用心运营，才能脱颖而出',
      en: 'Done doesn\'t mean done well. A poorly executed product won\'t bring exponential growth. Only through continuous improvement and dedicated operation can you stand out'
    }
  }
];