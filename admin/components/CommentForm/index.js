import BraftEditor from '@/components/Editor'
import React, { useState, useEffect, useRef } from 'react';
export const CommentForm = ({ comment, setComment, onChange }) => {
    const [editorState, setEditorState] = useState();
    return (
        <div className="comment-form">
            <BraftEditor
                style={{ borderBottom: '1px solid #ccc' }}
                value={comment.content}
                onChange={(value) => {
                    setComment((comment) => {
                        comment.content = value;
                        onChange(comment);
                    });
                }}
            ></BraftEditor>
            <div className="comment-userinfo">
                <Input
                    placeholder="用户名"
                    onChange={(e) => {
                        comment.name = e.target.value.replace(/[\d]/g, '')
                    }}
                    value={comment.name}
                    style={{ width: "40%", marginRight: 20 }}></Input>
                <Input placeholder="邮箱"
                    onChange={(e) => {
                        comment.email = e.target.value.replace(/[\d]/g, '')
                    }}
                    value={data.email}
                    style={{ width: "40%", marginRight: 20 }}></Input>
                <Button onClick={() => handleSubmitComment()}>提交</Button>
            </div>
        </div>
    )
}