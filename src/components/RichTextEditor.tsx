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

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const modules = {
    toolbar: [
      [{ 'font': ['pretendard', 'notosanskr', 'nanummyeongjo', 'playfair'] }],
      [{ 'size': ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '64px'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'clean']
    ],
  };

  const formats = [
    'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'align',
    'list', 'bullet',
    'link'
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-white"
      />
      <style>{`
        .rich-text-editor .ql-container {
          min-height: 150px;
          font-size: 16px;
        }
        .rich-text-editor .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="pretendard"]::before,
        .rich-text-editor .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="pretendard"]::before {
          content: 'Pretendard';
          font-family: 'Pretendard';
        }
        .rich-text-editor .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="notosanskr"]::before,
        .rich-text-editor .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="notosanskr"]::before {
          content: 'Noto Sans KR';
          font-family: 'Noto Sans KR';
        }
        .rich-text-editor .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="nanummyeongjo"]::before,
        .rich-text-editor .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="nanummyeongjo"]::before {
          content: '나눔명조';
          font-family: 'Nanum Myeongjo';
        }
        .rich-text-editor .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="playfair"]::before,
        .rich-text-editor .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="playfair"]::before {
          content: 'Playfair';
          font-family: 'Playfair Display';
        }
        
        /* Font sizes */
        .rich-text-editor .ql-snow .ql-picker.ql-size .ql-picker-label::before,
        .rich-text-editor .ql-snow .ql-picker.ql-size .ql-picker-item::before {
          content: attr(data-value) !important;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
