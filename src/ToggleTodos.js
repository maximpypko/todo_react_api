import { useEffect, useState } from 'react';

export function ToggleTodos({isCompletedAll, toggleAll}) {
  const [checked, setChecked] = useState(isCompletedAll);

  useEffect(() => {
    toggleAll(checked)
  },[checked])
  
  return (
    <>
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        checked={checked || isCompletedAll}
        onChange={(e) => {
          setChecked(e.target.checked)
        }}
        />
      <label htmlFor="toggle-all">Mark all as complete</label>
    </>
  );
}
