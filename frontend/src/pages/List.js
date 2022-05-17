import { useState } from 'react';
import sty from './list.module.css';
import {
  useNavigate,
} from "react-router-dom";
import user from '../images/user.png';
import d from '../images/d.png';
import h from '../images/h.png';
import h1 from '../images/h1.png';
import collect from '../images/collect.png';
import s from '../images/s.png'
import menu from '../images/menu.png'

export default function Login() {

  let navigate = useNavigate();


  return (
    <div className={sty.box}>
      <div className={sty.headerBox}>
        <div className={sty.headCenter}>
          <img style={{
            width: 30
          }} src={s} />
          <div className={sty.headerTit}>
            Explore
          </div>
          <img style={{
            width: 30
          }} src={menu} />
        </div>

      </div>

      <div className={sty.padding}>

      </div>

      <div className={sty.listBox}>

        {/* start */}
        <div className={sty.listItem}>
          <div className={sty.itemTop}>

          </div>
          <div className={sty.likeBox}>
            <div className={sty.likeLeft}>
              <img style={{
                width: 20
              }} src={h} />
              <span>10likes</span>
            </div>
            <div className={sty.likeRight}>
              <div>27 April 2022</div>
              <div style={{
                textAlign: 'right'
              }}>12:00PM</div>
            </div>
          </div>

          <div className={sty.userBox}>
            <div className={sty.userLeft}>
              <img style={{
                width: 30
              }} src={user} />
              <span>user name</span>
            </div>
            <div className={sty.userRight}>
              <div className={sty.iconBox}>
                <img src={h1} style={{
                  width: 25
                }} />
              </div>
              <div className={sty.iconBox}>
                <img src={d} style={{
                  width: 25
                }} />
              </div>
              <div style={{
                marginRight: 0
              }} className={sty.iconBox}>
                <img src={collect} style={{
                  width: 25
                }} />
              </div>
            </div>
          </div>

          <div className={sty.remarkBox}>
            <img style={{
              width: 20
            }} src={user} />
            <span>user name:</span>
            <div>
              dsdsdssld;sdl;
            </div>
          </div>

          <div className={sty.remarkBox}>
            <img style={{
              width: 20
            }} src={user} />
            <span>user name:</span>
            <div>
              dsdsdssld;sdl;
            </div>
          </div>

          <div className={sty.remarkBox}>
            <img style={{
              width: 20
            }} src={user} />
            <span>user name:</span>
            <div>
              dsdsdssld;sdl;
            </div>
          </div>
          <div>
            <input type="text" placeholder='writting something' className={sty.iputItem} />
          </div>

        </div>
        {/* end */}

        {/* start */}
        <div className={sty.listItem}>
          <div className={sty.itemTop}>

          </div>
          <div className={sty.likeBox}>
            <div className={sty.likeLeft}>
              <img style={{
                width: 20
              }} src={h} />
              <span>10likes</span>
            </div>
            <div className={sty.likeRight}>
              <div>27 April 2022</div>
              <div style={{
                textAlign: 'right'
              }}>12:00PM</div>
            </div>
          </div>

          <div className={sty.userBox}>
            <div className={sty.userLeft}>
              <img style={{
                width: 30
              }} src={user} />
              <span>user name</span>
            </div>
            <div className={sty.userRight}>
              <div className={sty.iconBox}>
                <img src={h1} style={{
                  width: 25
                }} />
              </div>
              <div className={sty.iconBox}>
                <img src={d} style={{
                  width: 25
                }} />
              </div>
              <div style={{
                marginRight: 0
              }} className={sty.iconBox}>
                <img src={collect} style={{
                  width: 25
                }} />
              </div>
            </div>
          </div>

          <div className={sty.remarkBox}>
            <img style={{
              width: 20
            }} src={user} />
            <span>user name:</span>
            <div>
              dsdsdssld;sdl;
            </div>
          </div>

          <div className={sty.remarkBox}>
            <img style={{
              width: 20
            }} src={user} />
            <span>user name:</span>
            <div>
              dsdsdssld;sdl;
            </div>
          </div>

          <div className={sty.remarkBox}>
            <img style={{
              width: 20
            }} src={user} />
            <span>user name:</span>
            <div>
              dsdsdssld;sdl;
            </div>
          </div>

          <div>
            <input type="text" placeholder='writting something' className={sty.iputItem} />
          </div>



        </div>
        {/* end */}


      </div>


    </div>
  );

}