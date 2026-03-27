import React, { useMemo, memo } from 'react';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// Register custom fonts
const Font = Quill.import('formats/font') as any;
Font.whitelist = ['pretendard', 'notosanskr', 'nanummyeongjo', 'playfair'];
Quill.register(Font, true);

// Register custom font sizes
const Size = Quill.import('formats/size') as any;
Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '64px'];
Quill.register(Size, true);

// Register custom line heights
const Parchment = Quill.import('parchment') as any;
const LineHeightStyle = new Parchment.StyleAttributor('lineheight', 'line-height', {
  scope: Parchment.Scope.INLINE,
  whitelist: ['1.0', '1.2', '1.4', '1.5', '1.6', '1.8', '2.0', '2.5', '3.0']
});
Quill.register(LineHeightStyle, true);

const LetterSpacingStyle = new Parchment.StyleAttributor('letterspacing', 'letter-spacing', {
  scope: Parchment.Scope.INLINE,
  whitelist: ['-0.05em', '-0.02em', '0', '0.02em', '0.05em', '0.1em', '0.2em']
});
Quill.register(LetterSpacingStyle, true);

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = memo(({ value, onChange, placeholder }) => {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'font': ['pretendard', 'notosanskr', 'nanummyeongjo', 'playfair'] }],
      [{ 'size': ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '64px'] }],
      [{ 'lineheight': ['1.0', '1.2', '1.4', '1.5', '1.6', '1.8', '2.0', '2.5', '3.0'] }],
      [{ 'letterspacing': ['-0.05em', '-0.02em', '0', '0.02em', '0.05em', '0.1em', '0.2em'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'clean']
    ],
    clipboard: {
      matchVisual: false,
    },
  }), []);

  const formats = useMemo(() => [
    'font', 'size', 'lineheight', 'letterspacing',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'align',
    'list',
    'link'
  ], []);

  const handleChange = (content: string) => {
    // Only call onChange if the content actually changed to avoid unnecessary parent updates
    if (content !== value) {
      onChange(content);
    }
  };

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-white"
      />
    </div>
  );
});

export default RichTextEditor;
