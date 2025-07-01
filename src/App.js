// src/App.js - Fixed Version (No Flash)
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

export default function App() {
  const [step, setStep] = useState(1);
  const [birthdate, setBirthdate] = useState('');
  const [stats, setStats] = useState(null);
  const [showHoverData, setShowHoverData] = useState(false);
  const [hoverWeek, setHoverWeek] = useState(null);
  const [animeLoaded, setAnimeLoaded] = useState(false);
  const weekGridRef = useRef(null);
  const statsRef = useRef(null);
  const formRef = useRef(null);
  
  // Load Anime.js from CDN
  useEffect(() => {
    if (window.anime) {
      setAnimeLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
    script.onload = () => {
      setAnimeLoaded(true);
      
      // Test anime immediately after loading
      if (window.anime) {
        window.anime({
          targets: 'h1',
          scale: [1, 1.02, 1],
          duration: 1000,
          easing: 'easeInOutQuad'
        });
      }
    };
    script.onerror = () => {
      console.error('Failed to load Anime.js');
    };
    document.head.appendChild(script);
  }, []);

  const calculateStats = (date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const birthYear = birthDate.getFullYear();
    
    const msInWeek = 1000 * 60 * 60 * 24 * 7;
    const weeksLived = Math.floor((today - birthDate) / msInWeek);
    
    const totalWeeks = Math.max(52*95, Math.round(weeksLived*1.3));
    const weeksRemaining = totalWeeks - weeksLived;
    const percentageLived = Math.round((weeksLived / totalWeeks) * 100);
    
    const msInDay = 1000 * 60 * 60 * 24;
    const daysLived = Math.floor((today - birthDate) / msInDay);
    
    const hoursSlept = Math.floor(daysLived * 8);
    const heartbeats = Math.floor(daysLived * 24 * 60 * 70);

    const coffeeStartAge = 18;
    const coffeeCupsPerDay = 2; // Average coffee cups per day
    const coffeeCups = Math.floor(Math.max(0, daysLived - (coffeeStartAge * 365.25)))* coffeeCupsPerDay;


    
    const breaths = Math.floor(daysLived * 24 * 60 * 16);
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

  const animateStepTransition = () => {
    if (!window.anime) {
      setStep(2);
      return;
    }
    
    if (!formRef.current) {
      setStep(2);
      return;
    }
    
    // Fade out form
    window.anime({
      targets: formRef.current,
      opacity: 0,
      translateY: -50,
      duration: 500,
      easing: 'easeInQuart',
      complete: () => {
        setStep(2);
        // Small delay before showing new content
        setTimeout(() => {
          animateWeekGrid();
          animateStats();
        }, 200);
      }
    });
  };

  const animateWeekGrid = () => {
    if (!window.anime || !weekGridRef.current) return;

    // Animate title first
    const title = weekGridRef.current.querySelector('h2');
    if (title) {
      window.anime({
        targets: title,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 600,
        easing: 'easeOutQuart'
      });
    }

    // Animate week cells - CSS already has them hidden
    const weekCells = weekGridRef.current.querySelectorAll('.week-cell');
    
    if (weekCells.length > 0) {
      window.anime({
        targets: weekCells,
        opacity: [0, 1],
        scale: [0.3, 1],
        duration: 800,
        delay: window.anime.stagger(2, {start: 300}),
        easing: 'easeOutElastic(1, .8)',
      });
    }

    // Animate year labels - CSS already has them hidden
    const yearLabels = weekGridRef.current.querySelectorAll('.year-label');
    
    if (yearLabels.length > 0) {
      window.anime({
        targets: yearLabels,
        opacity: [0, 1],
        translateX: [-30, 0],
        duration: 600,
        delay: window.anime.stagger(50, {start: 800}),
        easing: 'easeOutQuart'
      });
    }

    // Animate legend - CSS already has it hidden
    const legend = weekGridRef.current.querySelector('.legend');
    if (legend) {
      setTimeout(() => {
        window.anime({
          targets: legend,
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 500,
          easing: 'easeOutQuart'
        });
      }, 1500);
    }
  };

  const animateStats = () => {
    if (!window.anime || !statsRef.current) return;

    // Animate each section - CSS already has them hidden
    const sections = statsRef.current.querySelectorAll('.section');
    
    if (sections.length > 0) {
      window.anime({
        targets: sections,
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 800,
        delay: window.anime.stagger(200, {start: 1000}),
        easing: 'easeOutQuart'
      });
    }

    // Animate numbers with counting effect
    setTimeout(() => {
      animateNumbers();
    }, 1500);
  };

  const animateNumbers = () => {
    if (!window.anime || !stats) return;

    const numbersToAnimate = [
      { selector: '.weeks-lived', value: stats.weeksLived },
      { selector: '.percentage-lived', value: stats.percentageLived },
      { selector: '.days-lived', value: stats.daysLived },
      { selector: '.heartbeats', value: stats.heartbeats },
      { selector: '.breaths', value: stats.breaths }
    ];

    numbersToAnimate.forEach((item, index) => {
      const element = document.querySelector(item.selector);
      if (element) {
        setTimeout(() => {
          const obj = { value: 0 };
          window.anime({
            targets: obj,
            value: item.value,
            duration: 1500,
            easing: 'easeOutQuart',
            update: () => {
              element.textContent = new Intl.NumberFormat().format(Math.floor(obj.value));
            }
          });
        }, index * 100);
      }
    });
  };

  const animateWeekHover = (element) => {
    if (!window.anime) return;
    
    window.anime({
      targets: element,
      scale: [1, 1.4],
      duration: 200,
      easing: 'easeOutQuart'
    });
  };

  const animateWeekUnhover = (element) => {
    if (!window.anime) return;
    
    window.anime({
      targets: element,
      scale: [1.4, 1],
      duration: 200,
      easing: 'easeOutQuart'
    });
  };

  const handleSubmit = () => {
    if (!birthdate) return; // 👈 NEW LINE - prevents submission without date

    
    const calculatedStats = calculateStats(birthdate);
    setStats(calculatedStats);
    
    if (window.anime && animeLoaded) {
      animateStepTransition();
    } else {
      setStep(2);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

  const getFormattedNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const renderWeekGrid = () => {
    if (!stats) return null;
    
    const rows = [];
    const weeksPerRow = 52;
    const totalYears = Math.round(stats.totalWeeks/52);
    
    const birthDate = new Date(birthdate);
    const today = new Date();
    
    let currentAge = today.getFullYear() - birthDate.getFullYear();
    
    const birthdayThisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (today < birthdayThisYear) {
      currentAge--;
    }
    
    const lastBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (today < lastBirthday) {
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
          isPast = true;
        } else if (ageYear === currentAge) {
          if (weekInAge < weeksIntoCurrentAge - 4) {
            isPast = true;
          } else if (weekInAge >= weeksIntoCurrentAge - 4 && weekInAge < weeksIntoCurrentAge) {
            isRecent = true;
          } else if (weekInAge === weeksIntoCurrentAge) {
            isCurrent = true;
          }
        }
        
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
            onMouseEnter={(e) => {
              setHoverWeek({ 
                ageYear, 
                weekInAge: weekInAge + 1, 
                isPast, 
                isCurrent,
                isRecent,
                absoluteWeek: absoluteWeekNumber + 1
              });
              setShowHoverData(true);
              animateWeekHover(e.target);
            }}
            onMouseLeave={(e) => {
              setShowHoverData(false);
              animateWeekUnhover(e.target);
            }}
          />
        );
      }
      
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
      <div className="section" ref={weekGridRef}>
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
{/*           <div className="legend-item">
            <div className="legend-color week-recent"></div>
            <span>Recent</span>
          </div> */}
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
      <div className="stats-container" ref={statsRef}>
        <div className="section">
          <h2>Life highlights</h2>
          <div className="stats-content">
            <p>
              You've lived <strong><span className="weeks-lived">{getFormattedNumber(stats.weeksLived)}</span></strong> weeks, which is <strong><span className="percentage-lived">{stats.percentageLived}</span>%</strong> of a full life.
            </p>
            <p>
              That's <strong><span className="days-lived">{getFormattedNumber(stats.daysLived)}</span></strong> days of experience and approximately <strong>{getFormattedNumber(stats.seasons)}</strong> seasons observed.
            </p>
            <p>
              Your heart has beaten approximately <strong><span className="heartbeats">{getFormattedNumber(stats.heartbeats)}</span></strong> times.
            </p>
            <p>
              You've taken around <strong><span className="breaths">{getFormattedNumber(stats.breaths)}</span></strong> breaths and slept about <strong>{getFormattedNumber(stats.hoursSlept)}</strong> hours.
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
    if (window.anime && (weekGridRef.current || statsRef.current)) {
      // Animate out current content
      window.anime({
        targets: [weekGridRef.current, statsRef.current].filter(Boolean),
        opacity: 0,
        translateY: 50,
        duration: 500,
        easing: 'easeInQuart',
        complete: () => {
          setBirthdate('');
          setStats(null);
          setStep(1);
          
          // Animate in form
          setTimeout(() => {
            if (formRef.current) {
              formRef.current.style.opacity = '0';
              formRef.current.style.transform = 'translateY(50px)';
              
              window.anime({
                targets: formRef.current,
                opacity: [0, 1],
                translateY: [50, 0],
                duration: 600,
                easing: 'easeOutQuart'
              });
            }
          }, 100);
        }
      });
    } else {
      setBirthdate('');
      setStats(null);
      setStep(1);
    }
  };

  // Initial form animation when component mounts
  useEffect(() => {
    if (step === 1 && formRef.current && window.anime && animeLoaded) {
      formRef.current.style.opacity = '0';
      formRef.current.style.transform = 'translateY(30px)';
      
      window.anime({
        targets: formRef.current,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        easing: 'easeOutQuart'
      });
    }
  }, [step, animeLoaded]);

  return (
    <div className="app">
      <div className="container">
        <h1>Life in weeks {animeLoaded ? '✨' : '⏳'}</h1>
        <p className="subtitle">
          A simple visualization to reflect on the passage of time
          {animeLoaded ? '' : ' (Loading animations...)'}
        </p>
        
        {step === 1 ? (
          <div className="section" ref={formRef}>
            <h2>Enter a birthdate</h2>
            <div className="form">
              <input
                type="date"
                className="date-input"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                onKeyUp={handleKeyPress}  // 👈 NEW LINE - handles Enter key
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