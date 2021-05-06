import { useState } from 'react';

export function InputTodo({ onAddItem }) {
  const [inputValue, setInputValue] = useState('');
  const handlerValue = (e) => {
    if (e.target.value.trim()) {
      onAddItem(e.target)
    }
    setInputValue('')
  };

  return (
    <input
      className="new-todo"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={(e) => {
        if(e.key === 'Enter' && e.target.value.trim()) handlerValue(e)
        }
      }
      onBlur={(e) => handlerValue(e)}
      placeholder="What needs to be done?"
    />
  );
}
