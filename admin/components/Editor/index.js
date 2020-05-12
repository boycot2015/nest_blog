import React, { useState, useEffect, useRef } from 'react';
import cls from 'classnames';
import { Spin, Upload, message } from 'antd';
import {
    PictureOutlined
} from '@ant-design/icons';
import uploader from '@/api/file';
import { ContentUtils } from 'braft-utils';
import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/table.css';
import style from './index.module.scss';

// interface IProps {
//     value: string;
//     onChange: (arg: any) => void;
// }
// : React.FC

let BraftEditor;

export const Editor = ({ value = '', onChange, readOnly, placeholder = '请输入内容', styles }) => {
    const ref = useRef(null);
    const [editorState, setEditorState] = useState();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (!mounted) {
            return;
        }

        setEditorState(BraftEditor.createEditorState(value));
    }, [mounted, value]);

    useEffect(() => {
        Promise.all([
            import('braft-editor'),
            import('braft-extensions/dist/table'),
            import('braft-extensions/dist/markdown'),
        ]).then(res => {
            BraftEditor = res[0].default;
            const Table = res[1].default;
            const Markdown = res[2].default;
            const options = {
                defaultColumns: 3, // 默认列数
                defaultRows: 3, // 默认行数
                withDropdown: false, // 插入表格前是否弹出下拉菜单
                columnResizable: false, // 是否允许拖动调整列宽，默认false
                exportAttrString: '', // 指定输出HTML时附加到table标签上的属性字符串
            };
            BraftEditor.use(Table(options));
            BraftEditor.use(Markdown({}));
            setMounted(true);
        });

        return () => {
            setMounted(false);
        };
    }, []);

    const upload = param => {
        if (!param.file) {
            return false;
        }

        let size = param.file.size || 0;

        let hide = () => { };
        if (size > 1024 * 1024 * 4) {
            hide = message.loading('文件上传中...', 0);
        }
        let formdata = new FormData()
        formdata.append('file', param.file)
        formdata.append('name', param.file.uid)
        console.log(param.file, 'param.file')
        uploader.uploadFile(formdata)
            .then(res => {
                hide();
                setEditorState(
                    ContentUtils.insertMedias(editorState, [
                        {
                            type: 'IMAGE',
                            url: res.data,
                        },
                    ])
                );
            })
            .catch(() => {
                hide();
                message.error('文件上传失败，可能过大！');
            });
    };

    const controls = [
        'undo',
        'redo',
        'separator',
        'headings',
        'font-size',
        'font-family',
        // 'line-height',
        // 'letter-spacing',
        'separator',
        'list-ul',
        'list-ol',
        'blockquote',
        'code',
        'emoji',
        'separator',
        'link',
        'separator',

        'text-color',
        'bold',
        'italic',
        'underline',
        'strike-through',
        'separator',
        'superscript',
        'subscript',
        'remove-styles',
        'separator',
        'text-indent',
        'text-align',
        'separator',

        'hr',
        'separator',
        'table',
    ];
    const fontFamily = [{
        name: "宋体",
        family: '"宋体",sans-serif'
    }, {
        name: 'Araial',
        family: 'Arial, Helvetica, sans-serif'
    }, {
        name: 'Georgia',
        family: 'Georgia, serif'
    }, {
        name: 'Impact',
        family: 'Impact, serif'
    }, {
        name: 'Monospace',
        family: '"Courier New", Courier, monospace'
    }, {
        name: 'Tahoma',
        family: 'tahoma, arial, "Hiragino Sans GB", 宋体, sans-serif'
    }, {
        name: '黑体',
        family: '"黑体",serif'
    }, {
        name: '楷体',
        family: '楷体'
    }, {
        name: '幼圆',
        family: 'YouYuan'
    }]
    const extendControls = [
        {
            key: 'font-family',
        },
        {
            key: 'antd-uploader',
            type: 'component',
            component: (
                <Upload accept="image/*" showUploadList={false} customRequest={upload}>
                    <button
                        type="button"
                        className="control-item button upload-button"
                        data-title="插入图片"
                    >
                        <PictureOutlined />
                    </button>
                </Upload>
            ),
        }, {
            type: 'modal',
            text: 'Bar',
            html: '<span style="color:green;">Bar</span>',
            hoverTitle: 'Hello World!',
            modal: {
                id: 'test-modal', // v1.4.0新增，必选
                title: '这是一个弹出框',
                showClose: true,
                showCancel: true,
                showConfirm: true,
                confirmable: true,
                onCreate: (modalInstance) => { },
                onConfirm: () => console.log(1),
                onCancel: () => console.log(2),
                onClose: () => console.log(3),
                children: (
                    <div style={{ width: 480, height: 320, padding: 30 }}>
                        <span>Hello World！</span>
                    </div>
                )
            }
        }
    ];
    const editorProps = {
        height: 300,
        contentFormat: 'html',
        placeholder,
        readOnly,
        controls: controls,
        extendControls: extendControls,
        fontFamilies: fontFamily,
        value: editorState,
        initialContent: '<p>输入内容</p>',
        onChange: (editorState) => {
            setEditorState(editorState);
            const html = editorState.toHTML();
            onChange(html);
        },
        // onRawChange: this.handleRawChange
    }
    return mounted ? (
        <div className={cls(style.wrapper, '')} ref={ref}>
            <BraftEditor {...editorProps} />
        </div>
    ) : (
            <Spin tip="编辑器努力加载中..." spinning={true}></Spin>
        );
};