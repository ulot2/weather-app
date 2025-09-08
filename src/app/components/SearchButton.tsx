import React from 'react'
import "@/app/styles/SearchButton.css"

export const SearchButton = () => {
  return (
    <div className='search-container'>
        <h1>How's the sky looking today?</h1>
        <div className="search-input">
            <div className='search'>
                <img src="/images/icon-search.svg" alt="icon-search" />
                <input type="search" name="" id="" placeholder='Search for a place...'  />
            </div>
            <button type="button">Search</button>
        </div>
    </div>
  )
}
