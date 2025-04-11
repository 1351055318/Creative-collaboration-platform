import React, { useState, useEffect, useRef } from 'react';
import { Input, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export const TagsInput = ({ value = [], onChange, placeholder }) => {
  const [tags, setTags] = useState(value);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (value && value !== tags) {
      setTags(value);
    }
  }, [value]);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleClose = removedTag => {
    const newTags = tags.filter(tag => tag !== removedTag);
    setTags(newTags);
    if (onChange) {
      onChange(newTags);
    }
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = e => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      const newTags = [...tags, inputValue];
      setTags(newTags);
      if (onChange) {
        onChange(newTags);
      }
    }
    setInputVisible(false);
    setInputValue('');
  };

  return (
    <div>
      {tags.map(tag => (
        <Tag 
          key={tag} 
          closable 
          onClose={() => handleClose(tag)}
          style={{ marginBottom: 8 }}
        >
          {tag}
        </Tag>
      ))}
      {inputVisible ? (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          style={{ width: 100 }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : (
        <Tag 
          onClick={showInput} 
          style={{ 
            background: '#fff', 
            borderStyle: 'dashed',
            cursor: 'pointer'
          }}
        >
          <PlusOutlined /> {placeholder || '添加标签'}
        </Tag>
      )}
    </div>
  );
}; 