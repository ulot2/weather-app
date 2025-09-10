import React from 'react'
import "@/app/styles/SearchButton.css"

// type SearchButtonProps = {
//   value: string;
//   onChange: (value: string) => void;
//   onSearch: () => void;
// };

    export const SearchButton  = () => {
//   const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
//     if (e.key === 'Enter') onSearch();
//   };

  return (
    <div className='search-container'>
        <h1>How's the sky looking today?</h1>
        <div className="search-input">
            <div className='search'>
                <img src="/images/icon-search.svg" alt="icon-search" />
                <input 
                  type="search"
                  placeholder='Search for a place...'
                  
                />
            </div>
            <button type="button">Search</button>
        </div>
    </div>
  )
}
