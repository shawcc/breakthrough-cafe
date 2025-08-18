/**
 * 关于我们页面
 * 展示拨云见日团队的介绍、理念和服务特色
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import { Users, Target, Lightbulb, Heart } from 'lucide-react';

export const About: React.FC = () => {
  const { getContent } = useLanguage();

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: { zh: '精准解决', en: 'Precise Solutions' },
      description: { zh: '我们不只是写代码，更擅长定位问题根源，提供精准的解决方案', en: 'We don\'t just write code, we excel at pinpointing root causes and providing precise solutions' }
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: { zh: '经验积累', en: 'Experience Accumulation' },
      description: { zh: '多年的编程实战经验，踩过的坑都变成了帮助你的宝贵财富', en: 'Years of hands-on programming experience, every pitfall we\'ve encountered becomes valuable wealth to help you' }
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: { zh: '用心服务', en: 'Heartfelt Service' },
      description: { zh: '每一个技术问题背后都有人在努力实现梦想，我们用心对待每一次求助', en: 'Behind every technical problem is someone working hard to achieve their dreams, we treat every request with care' }
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: { zh: '全程陪伴', en: 'Full Journey Companion' },
      description: { zh: '从编程辅助到产品运营，从技术咨询到资源对接，全程陪伴你的创业路', en: 'From programming assistance to product operations, from technical consulting to resource networking, we accompany your entire entrepreneurial journey' }
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-300/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {getContent({
              zh: '关于拨云见日',
              en: 'About Breakthrough'
            })}
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {getContent({
              zh: '我们是一群热爱编程、深谙技术的专业人士，致力于帮助每一个在AI编程路上遇到困难的开发者',
              en: 'We are a group of passionate programming professionals who love technology, dedicated to helping every developer who encounters difficulties on their AI programming journey'
            })}
          </motion.p>

          <motion.div
            className="inline-block px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-full text-lg font-semibold"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {getContent({
              zh: '2025年，AI不成熟，但我们成熟',
              en: 'In 2025, AI is not mature, but we are'
            })}
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {getContent({
                zh: '我们的使命',
                en: 'Our Mission'
              })}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {getContent({
                zh: '拨云见日，寓意在迷雾中找到光明的方向。我们希望成为每个开发者技术路上的明灯，帮助大家突破技术瓶颈，实现产品梦想。',
                en: 'Breakthrough means finding the direction of light in the fog. We hope to become a beacon for every developer on their technical journey, helping everyone break through technical bottlenecks and realize product dreams.'
              })}
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-600 to-amber-600 rounded-xl flex items-center justify-center text-white">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {getContent(feature.title)}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {getContent(feature.description)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {getContent({
                zh: '我们的故事',
                en: 'Our Story'
              })}
            </h2>
            
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="mb-6">
                {getContent({
                  zh: '在AI编程时代，我们看到太多开发者在技术路上独自摸索，遇到困难时只能反复试错，浪费大量时间和精力。',
                  en: 'In the AI programming era, we see too many developers exploring technical paths alone, only able to repeatedly try and error when encountering difficulties, wasting a lot of time and energy.'
                })}
              </p>
              
              <p className="mb-6">
                {getContent({
                  zh: '我们深知每一行代码背后的付出，每一个bug修复的不易，每一次部署成功的喜悦。正是这种同理心，让我们决定为开发者提供专业的技术辅助服务。',
                  en: 'We deeply understand the effort behind every line of code, the difficulty of every bug fix, and the joy of every successful deployment. It is this empathy that made us decide to provide professional technical assistance services for developers.'
                })}
              </p>
              
              <p>
                {getContent({
                  zh: '从单纯的代码辅助，到全链路的产品服务，我们希望成为每个技术人实现梦想路上最可靠的伙伴。',
                  en: 'From simple code assistance to full-chain product services, we hope to become the most reliable partner for every technical person on their journey to realize their dreams.'
                })}
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};