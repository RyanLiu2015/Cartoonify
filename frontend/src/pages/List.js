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
import menu from '../images/menu.png'
import axios from 'axios';

export default function Login() {
  let navigate = useNavigate();
  let [menuActive, setMenuActive] = useState(false);
  const username = window.localStorage.username;

  const [listData, setListData] = useState([{
    likeNum: 10,
    commentValue: '',
    commentList: [{
      content: 'test1'
    }, {
      content: 'test2'
    }, {
      content: 'test3'
    },]
  }]);



  return (
    <div className={sty.box}>
      <div className={sty.headerBox}>
        <div className={sty.headCenter}>
          <div className={sty.headerTit}>
            Cartoonity
          </div>

          <div style={{
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 'bold'
          }}>
            <span style={{
              marginRight: 15
            }}>{username}</span>
            <img onClick={() => {
              setMenuActive(!menuActive)
            }} style={{
              width: 30
            }} src={menu} />
          </div>
        </div>
        <div style={{
          transform: `translate(0, ${menuActive ? '0' : '-100%'})`
        }} className={sty.headNavBox}>
          <div onClick={() => {
            navigate('/')
          }} className={sty.headNavItem}>
            Index
          </div>
          <div onClick={() => {
            navigate('/login')
          }} className={sty.headNavItem}>
            Login/Register
          </div>
          <div onClick={() => {
            navigate('/list')
          }} className={sty.headNavItem}>
            feed
          </div>
          {username && (
            <div onClick={() => {
              window.localStorage.removeItem("username")
              navigate('/login')

            }} style={{
              textAlign: 'center',
              color: 'red'
            }} className={sty.headNavItem}>
              退出
            </div>
          )}
        </div>
      </div>

      <div className={sty.padding}>

      </div>

      <div className={sty.listBox}>

        {listData.map((v, i) => {
          return (
            <div key={i} className={sty.listItem}>
              <div className={sty.itemTop}>

              </div>
              <div className={sty.likeBox}>
                <div className={sty.likeLeft}>
                  <img style={{
                    width: 20
                  }} src={h} />
                  <span>{v.likeNum}likes</span>
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
                    <img onClick={() => {
                      // action like
                      let deepData = [...listData];
                      let likeNum = deepData[i].likeNum;
                      deepData[i].likeNum = Number(likeNum) + 1;
                      setListData(deepData);
                    }} src={h1} style={{
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

              {v.commentList.map((value, index) => {
                return (
                  <div key={index} className={sty.remarkBox}>
                    <img style={{
                      width: 20
                    }} src={user} />
                    <span>user name:</span>
                    <div>
                      {value.content}
                    </div>
                  </div>
                );
              })}

              <div className={sty.sendBox}>
                <input value={v.commentValue} onChange={(e) => {
                  let val = e.target.value;
                  let deepData = [...listData];
                  deepData[i].commentValue = val;
                  console.log("val = ", val)
                  console.log("deepData = ", deepData)
                  setListData(deepData);
                }} type="text" placeholder='writting something' className={sty.iputItem} />
                <button onClick={() => {
                  let deepData = [...listData];
                  console.log("deepData = ", deepData)
                  deepData[i]['commentList'].push( {
                    content: deepData[i].commentValue
                  });
                  deepData[i].commentValue = '';
                  setListData(deepData);
                }} style={{
                  marginLeft: 10
                }}>send</button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}