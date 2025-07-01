// src/App.js
import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [step, setStep] = useState(1);
  const [birthdate, setBirthdate] = useState('');
  const [stats, setStats] = useState(null);
  const [showHoverData, setShowHoverData] = useState(false);
  const [hoverWeek, setHoverWeek] = useState(null);
  
  const calculateStats = (date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const birthYear = birthDate.getFullYear();
    
    // Calculate weeks lived
    const msInWeek = 1000 * 60 * 60 * 24 * 7;
    const weeksLived = Math.floor((today - birthDate) / msInWeek);
    
    // Assuming average lifespan of ~90 years (4160 weeks)
    const totalWeeks = Math.max(52*90, Math.round(weeksLived*1.3));// 90 years * 52 weeks per year
    const weeksRemaining = totalWeeks - weeksLived;
    const percentageLived = Math.round((weeksLived / totalWeeks) * 100);
    
    // Calculate days lived
    const msInDay = 1000 * 60 * 60 * 24;
    const daysLived = Math.floor((today - birthDate) / msInDay);
    
    // Calculate hours slept (assuming 8 hours per day)
    const hoursSlept = Math.floor(daysLived * 8);
    
    // Calculate heartbeats (average 70 bpm)
    const heartbeats = Math.floor(daysLived * 24 * 60 * 70);

    // Calculate cups of coffee consumed (assuming 1 cup per day starting at age 18)
    const coffeeStartAge = 18; // Starting age for coffee consumption
    const coffeeCups = Math.floor(Math.max(0, daysLived - (coffeeStartAge * 365.25))); // Adjust for leap years
    
    
    // Calculate breaths (average 16 breaths per minute)
    const breaths = Math.floor(daysLived * 24 * 60 * 16);

    // Calculate seasons experienced
    const seasons = Math.floor(daysLived / 91.25);
    
    return {
      weeksLived,
      totalWeeks,
      weeksRemaining,
      percentageLived,
      daysLived,
      hoursSlept,
      heartbeats,
      breaths,
      seasons,
      birthYear,
      coffeeCups
    };
  };

  const handleSubmit = () => {
    setStats(calculateStats(birthdate));
    setStep(2);
  };

  const getFormattedNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const renderWeekGrid = () => {
  if (!stats) return null;
  
  const rows = [];
  const weeksPerRow = 52; // One age year per row
  const totalYears = Math.round(stats.totalWeeks/52); // Changed to match your 90-year lifespan
  
  const birthDate = new Date(birthdate);
  const today = new Date();
  
  // Calculate accurate age (not just year difference)
  let currentAge = today.getFullYear() - birthDate.getFullYear();
  
  // Check if birthday has passed this year
  const birthdayThisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (today < birthdayThisYear) {
    currentAge--; // Haven't had birthday yet this year
  }
  
  // Calculate which week we are in the current age year
  // Find the start of current age year (last birthday)
  const lastBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (today < lastBirthday) {
    // Last birthday was previous year
    lastBirthday.setFullYear(today.getFullYear() - 1);
  }
  
  const msInWeek = 1000 * 60 * 60 * 24 * 7;
  const weeksIntoCurrentAge = Math.floor((today - lastBirthday) / msInWeek);
  
  for (let ageYear = 0; ageYear < totalYears; ageYear++) {
    const weekCells = [];
    
    for (let weekInAge = 0; weekInAge < weeksPerRow; weekInAge++) {
      let cellClass = "week-cell ";
      let isPast = false;
      let isCurrent = false;
      let isRecent = false;
      
      if (ageYear < currentAge) {
        // Complete past age years
        isPast = true;
      } else if (ageYear === currentAge) {
        // Current age year
        if (weekInAge < weeksIntoCurrentAge - 4) {
          isPast = true;
        } else if (weekInAge >= weeksIntoCurrentAge - 4 && weekInAge < weeksIntoCurrentAge) {
          isRecent = true; // Keep your recent weeks feature
        } else if (weekInAge === weeksIntoCurrentAge) {
          isCurrent = true;
        }
      }
      // Future age years remain as default (future)
      
      if (isPast) {
        cellClass += "week-past ";
      } else if (isRecent) {
        cellClass += "week-recent ";
      } else if (isCurrent) {
        cellClass += "week-current ";
      } else {
        cellClass += "week-future ";
      }
      
      const absoluteWeekNumber = ageYear * weeksPerRow + weekInAge;
      
      weekCells.push(
        <div 
          key={weekInAge}
          className={cellClass}
          onMouseEnter={() => {
            setHoverWeek({ 
              ageYear, 
              weekInAge: weekInAge + 1, 
              isPast, 
              isCurrent,
              isRecent,
              absoluteWeek: absoluteWeekNumber + 1
            });
            setShowHoverData(true);
          }}
          onMouseLeave={() => setShowHoverData(false)}
        />
      );
    }
    
    // Only show age numbers for ages that have been lived (including current age)
    const showAgeLabel = ageYear <= currentAge;
    
    rows.push(
      <div key={ageYear} className="year-row">
        <div className="year-label">{showAgeLabel ? ageYear : ''}</div>
        <div className="week-row">
          {weekCells}
        </div>
      </div>
    );
  }
  
  return (
    <div className="section">
      <h2>Your life in weeks</h2>
      <div className="debug-info">
        Current age: {currentAge} years, Week {weeksIntoCurrentAge + 1} of age {currentAge}.
      </div>
      <div className="week-grid">
        {rows}
      </div>
      
      {showHoverData && hoverWeek && (
        <div className="hover-info">
          Age {hoverWeek.ageYear}, Week {hoverWeek.weekInAge} (Week {hoverWeek.absoluteWeek} of life): 
          {hoverWeek.isPast ? 
            " A week from your past" : 
            hoverWeek.isRecent ?
            " A recent week" :
            hoverWeek.isCurrent ? 
            " Your current week" : 
            " A week in your potential future"}
        </div>
      )}
      
      <div className="legend">
        <div className="legend-item">
          <div className="legend-color week-past"></div>
          <span>Past</span>
        </div>
        <div className="legend-item">
          <div className="legend-color week-recent"></div>
          <span>Recent</span>
        </div>
        <div className="legend-item">
          <div className="legend-color week-current"></div>
          <span>Present</span>
        </div>
        <div className="legend-item">
          <div className="legend-color week-future"></div>
          <span>Future</span>
        </div>
      </div>
    </div>
  );
};

  const renderStats = () => {
    if (!stats) return null;
    
    return (
      <div className="stats-container">
        <div className="section">
          <h2>Life highlights</h2>
          <div className="stats-content">
            <p>
              You've lived <strong>{getFormattedNumber(stats.weeksLived)}</strong> weeks, which is <strong>{stats.percentageLived}%</strong> of a full life.
            </p>
            <p>
              That's <strong>{getFormattedNumber(stats.daysLived)}</strong> days of experience and approximately <strong>{getFormattedNumber(stats.seasons)}</strong> seasons observed.
            </p>
            <p>
              Your heart has beaten approximately <strong>{getFormattedNumber(stats.heartbeats)}</strong> times.
            </p>
            <p>
              You've taken around <strong>{getFormattedNumber(stats.breaths)}</strong> breaths and slept about <strong>{getFormattedNumber(stats.hoursSlept)}</strong> hours.
            </p>
          </div>
        </div>
        
        <div className="section">
          <h2>Cosmic perspective</h2>
          <div className="stats-content">
            <p>
              Since your birth, Earth has traveled approximately <strong>{getFormattedNumber(Math.round(stats.daysLived * 1.6 * 1000000))}</strong> kilometers through space around the Sun.
            </p>
            <p>
              The observable universe is about <strong>93</strong> billion light-years across, meaning light takes <strong>93</strong> billion years to cross it. Your entire lifespan is just <strong>{(80/13800000000 * 100).toFixed(10)}%</strong> of the universe's age.
            </p>
          </div>
        </div>
        
        <div className="section">
          <h2>Natural world</h2>
          <div className="stats-content">
            <p>
              You've experienced approximately <strong>{getFormattedNumber(Math.round(stats.daysLived / 29.53))}</strong> lunar cycles and <strong>{getFormattedNumber(Math.floor(stats.daysLived / 365.25))}</strong> trips around the Sun.
            </p>
            <p>
              A giant sequoia tree can live over 3,000 years. Your current age is <strong>{((stats.daysLived / 365.25) / 3000 * 100).toFixed(2)}%</strong> of its potential lifespan.
            </p>
            <p>
              During your lifetime, your body has replaced most of its cells several times. You are not made of the same atoms you were born with.
            </p>
          </div>
        </div>
        <div className="section">
          <h2>Consumption</h2>
          <div className="stats-content">
            <p>
              You've drinked approximately <strong>{getFormattedNumber(Math.round(stats.coffeeCups))}</strong> coffee cups
            </p>
          </div>
        </div>
      </div>
    );
  };

  const handleReset = () => {
    setBirthdate('');
    setStats(null);
    setStep(1);
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Life in weeks</h1>
        <p className="subtitle">A simple visualization to reflect on the passage of time</p>
        
        {step === 1 ? (
          <div className="section">
            <h2>Enter a birthdate</h2>
            <div className="form">
              <input
                type="date"
                className="date-input"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                required
              />
              <button
                onClick={handleSubmit}
                className="primary-button"
                disabled={!birthdate}
              >
                Visualize your time
              </button>
            </div>
          </div>
        ) : (
          <>
            {renderWeekGrid()}
            {renderStats()}
            <button
              onClick={handleReset}
              className="secondary-button"
            >
              Start over
            </button>
          </>
        )}
      </div>
    </div>
  );
}