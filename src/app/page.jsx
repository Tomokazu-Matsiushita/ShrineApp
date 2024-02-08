'use client'

import React, { useState } from 'react';
import TempleSearch from '/Users/tomokazumatsushita/Temple_Shrine_App/my-app/src/components/TempleSearch.jsx';
import axios from 'axios';
// import myLocalImage from './IMG_3086.jpg'; // Importing local image with relative path
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Page = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('ja'); // Default to Japanese
  const [duration, setDuration] = useState(0);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/search?title=${encodeURIComponent(title)}&lang=${language}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setSearchResults(data);
      } else {
        console.error('Expected an array but got:', data);
        setSearchResults([]); // データが配列でない場合は空の配列をセットする
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]); // エラーが発生した場合は空の配列をセットする
    }
  };

  const readAloud = (content) => {
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = 'ja-JP'; // Set the language to Japanese
    window.speechSynthesis.speak(utterance);
  };

  const stopReading = () => {
    window.speechSynthesis.cancel();
  };

  const handleSliderChange = (event) => {
    setDuration(event.target.value);
  };

  // テキストの読み上げ時間を計算する関数
   const calculateReadAloudDuration = (text) => {
    const charactersPerMinute = 400; // 1分あたりの平均文字数
    const numberOfCharacters = text.length;
    return numberOfCharacters / charactersPerMinute;
  };

  return (
    <React.Fragment>
      <div className="navbar bg-neutral text-neutral-content fixed top-0 w-full">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><a>Homepage</a></li>
              <li><a>Portfolio</a></li>
              <li><a>About</a></li>
            </ul>
          </div>
        </div>
        <div className="navbar-center">
          <a className="btn btn-ghost text-xl">LISTEN</a>
        </div>
        <div className="navbar-end">
          <button className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
          <button className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>
        </div>
      </div>
      {/* publicフォルダ内の画像を使用する場合 */}
      {/* <div className="rounded-box" style={{ marginTop: '4rem' }}> */}
      <div style={{ display: 'flex', justifyContent: 'center' }}> 
        <img src="https://cdn.pixabay.com/photo/2017/01/13/08/08/tori-1976609_1280.jpg" className="rounded-lg" alt="building" style={{ width: '50%', height: 'auto' }}/>
      </div>
      {/* </div> */}
      <div className="form-control">
        <label className="label">
          <span className="label-text mx-5">Shrine</span>
        </label>
        <input type="text" placeholder="Type here" className="input input-bordered mx-5 mb-2" value={title} onChange={(e) => setTitle(e.target.value)} />
        <button className="btn mx-4 my-2" onClick={handleSearch}>Search</button>
      </div>
      <div className="search-results">
        {/* ... existing search results list ... */}
        <input type="range" min={0} max="30" value={duration} className="range range-accent m-5 range-xs" onChange={handleSliderChange}/>
        <span className='m-5'>{duration} minute(s)</span>
        <ul>
          {searchResults.map((result) => {
            const maxDuration = calculateReadAloudDuration(result.Content);
            return (
            <li key={result.Href}>
              <p className="flex justify-center w-full">{result.Title} (Max duration: {maxDuration.toFixed(2)} minutes)</p>
              <div className="flex justify-center w-full">
                <button className="btn btn-active btn-sm" onClick={() => readAloud(result.Content)}>Start</button>
                <div className="divider">or</div>
                <button className="btn btn-active btn-neutral btn-sm" onClick={stopReading}>Stop</button>
              </div>
            </li>
            );
          })}
        </ul>
      </div>
      <footer className="footer p-10 bg-neutral text-neutral-content bottom-0 w-full">
        <nav>
          <header className="footer-title">Services</header> 
          <a className="link link-hover">Branding</a>
          <a className="link link-hover">Design</a>
          <a className="link link-hover">Marketing</a>
          <a className="link link-hover">Advertisement</a>
        </nav> 
        <nav>
          <header className="footer-title">Company</header> 
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
        </nav> 
        <nav>
          <header className="footer-title">Legal</header> 
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </nav>
      </footer>
    </React.Fragment>
  );
};

export default Page;
