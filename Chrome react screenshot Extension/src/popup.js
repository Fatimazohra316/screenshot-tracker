import React, { useState, useEffect } from 'react';
import verified from '../src/images/verified.webp';
import arrow from '../src/images/arrow.webp';
import setting from "../src/images/setting.webp";
import moreicon from "../src/images/moreIcon.webp";
import play from '../src/images/playButton.webp';
import stop from '../src/images/stopButton.webp';
import dropdown from '../src/images/dropdown.webp';
import addProject from '../src/images/addProjectIcon.webp';

const Timer = (props) => {
  // alert("hello from js")
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timeId = null;
  // Empty dependency array, so the effect runs only once
  useEffect(() => {
    const handleTabChange = () => {
      // Capture screenshot when changing tabs
      captureScreenshot();
    };

    window.addEventListener('beforeunload', handleTabChange);

    return () => {
      window.removeEventListener('beforeunload', handleTabChange);
    };
  }, []);
  const [project, setProject] = useState('');
  const [projectList, setProjectList] = useState([]);
  const [data, setData] = useState({});
  const model = {
    projectId: "643fb528272a1877e4fcf30e",
    description: "Working on feature X"
  };
  const items = JSON.parse(localStorage.getItem('items'));
  const apiURL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");

  const days = ["Saturday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const date = new Date();
  const day = date.getDay();
  const dayName = days[day];
  const currentDate = date.getDate();
  const month = months[date.getMonth()];


  // chrome.runtime.sendMessage({ items, token, apiURL, model })
  const addTask = () => {


    console.log(month);

    projectList.push({ project, dayName, month, currentDate });
    setProjectList([...projectList]);


  }

  useEffect(() => {
    const runningState = localStorage.getItem('running');
    if (runningState) {
      setIsRunning(JSON.parse(runningState));
    }
  }, []);

  const startTimer = () => {
    setIsRunning(true);
    localStorage.setItem('running', true);
    chrome.runtime.sendMessage({ action: 'startTimer', token, model });
    // Other logic for starting the timer
  };

  const stopTimer = () => {
    setIsRunning(false);
    localStorage.setItem('running', false);
    chrome.runtime.sendMessage({ action: 'stopTimer', token });

    // Other logic for stopping the timer
  };
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('items'));
    const apiURL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");
    const model = {
      projectId: "643fb528272a1877e4fcf30e",
      description: "Working on feature X"
    };

    chrome.runtime.sendMessage({ items, token, apiURL, model, isRunning });
  }, []);
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const logOut = () => {
   stopTimer();

    localStorage.removeItem('items');
    localStorage.removeItem('token');
    props.setLogin(false);
  };

  const captureScreenshot = () => {
    chrome.runtime.sendMessage({ action: 'captureScreenshot' });
  };

  const getData = async () => {
    const headers = {
      Authorization: "Bearer " + token,
    };

    // console.log("hello world");
    try {
      const response = await fetch(`${apiURL}/timetrack/hours`, {
        headers,
        method: "GET",
        mode: "cors",
      })
      // console.log(response);

      if (response.ok) {
        const json = await response.json();
        // console.log(json.data);
        setData(json.data);
        // setChange(false)
      } else {
        console.log('Failed to delete object:', response.status, response.statusText);

      }
      // console.log(response);
    } catch {

    }
  }
  // console.log(data);
  useEffect(() => {
    getData();
    const handleWindowClose = () => {
      // Call the stopTimer function when the window is closed
      stopTimer();
    };

    window.addEventListener('beforeunload', handleWindowClose);

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
    };

  }, [])
  return (
    <div>
      <section class="popUp">

        <div class="popBodyContentMain">
          <div class="popBodyMain">
            <div class="popBodyContent">


              <div class="userNamenVerified">
                <h5 class="userNameContent">{items?.name}</h5>
                <div class="verifiedMainContent">
                  <img class="verified" src={verified} alt="verified.png" />
                </div>
              </div>
              <div class="mianDropDownContent">
                <div class="dropdown">
                  <div class="companies">
                    <div class="company-dropdown">
                      <a class="nav-link dropdown-toggle1" href="#" role="button" aria-expanded="false">
                        Y8HR
                      </a>
                    </div>
                    <img class="dropdown-img" src={dropdown} alt="" />
                  </div>
                  <ul class="dropdown-content dropdown-menu">
                    <a href="#" class="dropdown-item">Y8HR</a>
                    <a href="#" onClick={logOut} class="dropdown-item">Log Out</a>
                  </ul>
                </div>
                <button class="settingbuttonMain"><img class="settingbutton" src={setting} alt="setting.png" /></button>
                <button class="morebuttonMain"><img class="morebutton" src={moreicon} alt="moreIcon.png" /></button>
              </div>
            </div>
            <div class="inviteForm">
              <input class="inviteFormInput" onChange={(e) => setProject(e.target.value)} type="text" placeholder="What project are you engaged in?" />
              <button onClick={addTask} class="inviteButton"><img class="addProjectIcon" src={addProject} alt="addProjectIcon.png" /> Add Project</button>
            </div>
            <div class="desktopAppScroll">
              <div class="datenNote">
                <div class="datenNoteActiveImgMain">
                  <img class="datenNoteActiveImg" src={arrow} alt="arrow.png" />
                </div>
                <div class="datenNoteMain">
                  <div class="datenNoteMainContent">
                    <div class="date">
                      <h5 class="dateContent">{dayName}</h5>
                    </div>
                    <div class="note">
                      <h5 class="noteContent">no note</h5>
                    </div>
                  </div>
                  <div class="timeOfDatenNote">
                    <div class="hoursMain">
                      <h6 class="hours">{data?.totalHours?.daily}</h6>

                    </div>
                  </div>
                </div>
              </div>
              {projectList.map((element) => {
                return (
                  <div class="datenNoteOld">
                    <div class="datenNoteActiveImgMain">
                      <img class="datenNoteNonActiveImg" src={arrow} alt="arrow.png" />
                    </div>
                    <div class="datenNoteMainOld">
                      <div class="datenNoteMainContentOld">
                        <div class="date">
                          <h5 class="dateContent">{element.dayName} </h5>
                          <h5 class="datenCurrentDay">{element.month}   {element.currentDate}</h5>
                        </div>
                        <div class="note">
                          <h5 class="noteContent">{element.project}</h5>
                        </div>
                      </div>
                      {/* <div class="timeOfDatenNote">
                        <div class="hoursMain">

                          <h6 class="hours">6</h6>
                          <h6 class="hoursText">h:</h6>
                          <h6 class="minutes">30</h6>
                          <h6 class="minutesText">m</h6>
                        </div>
                      </div> */}
                    </div>
                  </div>
                )
              })}

            </div>
          </div>
        </div>
      </section>
      <section class="popUp">
        <div class="playnTimelineButtonsMain">
          <div class="playnStopbuttontextMain">
            <div class="playButtonMain">
              {/* <button class="playButton"><img class="playButtonMainContent" src={start ? stop : play} alt="playButton.png" /> </button>
              <button class="playButton stopButtonMainContent"></button> */}
              {isRunning ? (
                <img class="playButtonMainContent" src={stop} onClick={stopTimer} />
              ) : (
                <img class="playButtonMainContent" src={play} onClick={startTimer} />
              )}
            </div>
            {!isRunning ? <h6 class="playnStopbuttontext">Click to Play</h6> : <h6 class="playnStopbuttontext">Click to Pause</h6>}

          </div>
          <div class="daynTimelineButton">
            <div class="daynTime">
              <h6 class="todayonBottom">Today</h6>
              <div className='dateDiv'>
                <div class="timeOfDatenNote">
                  <div class="hoursMain">
                    <h6>{data?.totalHours?.daily}</h6>
                    {/* <h6 class="hours">6</h6>
          <h6 class="hoursText">h:</h6>
          <h6 class="minutes">30</h6>
          <h6 class="minutesText">m</h6> */}
                  </div>
                </div>
                <div class="viewTimelineButtonMain">
                  <button onClick={captureScreenshot} class="viewTimelineButton">View Timeline</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* <h1>Time: {formatTime(time)}</h1>
      {isRunning ? (
        <button onClick={stopTimer}>Stop</button>
      ) : (
        <button onClick={startTimer}>Start</button>
      )}
      <br />
    
      <button>Logout</button> */}
    </div>
  );
};

export default Timer;
