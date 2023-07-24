import React, { useState } from 'react';
import popupHead from '../src/images/popHeadLogo.webp';
import minimize from '../src/images/minimize.webp';
import maximize from '../src/images/maximize.webp';
import close from '../src/images/CloseIcon.webp';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

function SignIn(props) {
    
  const navigate = useNavigate();
  const [model, setModel] = useState({});
  const [decodedToken, setDecodedToken] = useState(null);
  const apiURL = process.env.REACT_APP_API_URL;





  const [err, setErr] = useState("")
  // const url = "https://dull-gold-indri-kit.cyclic.app/api/v1/signin/"
  const loginUser = (e) => {
    e.preventDefault();
    fetch(`${apiURL}/signin/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify(model),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          setErr(data.message);

        }
        else {
          // console.log(data);
          const token = data.token;
          const decoded = jwtDecode(token);
          console.log(decoded);
          const items = localStorage.setItem("items", JSON.stringify(decoded));
          localStorage.setItem("token", (data?.token))
          navigate('/dashboard')
          props.setLogin(true)

          console.log(items);





        }

      })
  }
  let fillModel = (key, val) => {
    model[key] = val;
    setModel({ ...model })


  }

  return (
    <div>
      <section class="popUp">

        <div class="popHeadContentMain">
          <div class="popHeadContent">
            <div class="popHeadLogo">
              <img class="popHeadLogoImg" src={popupHead} alt="popHeadLogo.png" />
            </div>
            {/* <div class="popHeadButtons">
              <div class="popButtonMain">
                <button class="minimize"><img src={minimize} alt="minimize.png" /></button>
              </div>
              <div class="popButtonMain">
                <button class="minimize"><img src={maximize} alt="maximize.png" /></button>
              </div>
              <div class="popButtonMain">
                <button class="minimize"><img src={close} alt="CloseIcon.png" /></button>
              </div>
            </div> */}
          </div>
        </div> 
      </section>
      <section class="popUp">

        <div class="popBodyContentMain">
          <div class="popBodyMain">
            <section>
              <p className="accessFont">Access Your Account</p>
              <form onSubmit={loginUser} className="maininputdivs">
                <div className="mainInputDiv">


                  <div className="inputDiv">
                    {/* <div><img src={email} /></div> */}
                    <input onChange={(e) => fillModel("email", e.target.value)} required placeholder="Email" />
                  </div>
                  <div className="inputDiv">
                    {/* <div><img src={password} /></div> */}
                    <input type="password" onChange={(e) => fillModel("password", e.target.value)} placeholder="Password (8 or more characters)" />
                  </div>
                  <p className="err">{err}</p>
                 
                  <button type="submit" className="accountButton">
                    Login
                  </button>
                </div>
              </form>
             
            </section>


          </div>
        </div>
      </section>
      <section class="popUp">
        <div class="playnTimelineButtonsMain">


        </div>
      </section>
    </div>


  );
};

export default SignIn;
