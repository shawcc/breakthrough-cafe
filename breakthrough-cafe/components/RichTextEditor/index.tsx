/**
 * 富文本编辑器组件
 * 基于 ReactQuill 的可定制富文本编辑器
 */

import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = '请输入文章内容...',
  height = '400px'
}) => {
  // 编辑器配置
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean']
      ]
    },
    clipboard: {
      matchVisual: false
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'align',
    'code-block'
  ];

  return (
    <div className="rich-text-editor">
      <style>
        {`
          .rich-text-editor .ql-editor {
            min-height: ${height};
            font-size: 16px;
            line-height: 1.6;
          }
          .rich-text-editor .ql-toolbar {
            border: 1px solid #d1d5db;
            border-bottom: none;
            border-radius: 12px 12px 0 0;
          }
          .rich-text-editor .ql-container {
            border: 1px solid #d1d5db;
            border-radius: 0 0 12px 12px;
            font-family: inherit;
          }
          .rich-text-editor .ql-editor:focus {
            outline: none;
          }
          .rich-text-editor .ql-editor.ql-blank::before {
            color: #9ca3af;
            font-style: normal;
          }
        `}
      </style>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
};
