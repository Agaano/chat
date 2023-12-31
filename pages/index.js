import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import style from '@/styles/index.module.css'
import send from '../images/send.svg';
import cookies from 'js-cookie';

export default function Home() {
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [messages, SetMessages] = useState([]);
  const [theme, setTheme] = useState(() => {
   const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
   return savedTheme;
  })


  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  },  [theme]);

  const toggleTheme = () => setTheme(theme == "light" ? "dark" : "light");
    
  useEffect(() => {
    const getMessages = async () => {
      const response = await fetch('/api/getAllMessages')
      const data = await response.json();
      SetMessages(data.data);
    }
    const interval = setInterval(async () => {
      getMessages();
    }, 1000);

    getMessages();

    const getName = async () => {
      const response = await fetch('https://randomuser.me/api/', {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      setName(data.results[0].name.first);
      cookies.set('_n', data.results[0].name.first);
    }
    if (cookies.get('_n')) setName(cookies.get('_n')); 
    else getName()
    return () => {
      clearInterval(interval);
    };


  }, []) 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.trim() === '') return;
    setText('');
    console.log('click');
    const response = await fetch('/api/sendMessage', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: name,
        text: text,
      })
    })
  }

  const checkingDate = (date) => {
    let result = '';
    let strDate = String(date);

    {strDate.length == 1 ? result = `0${strDate}` : result = strDate};
    return result;
  };

  const showAnswerBtn = (name) => {
    setText(`${name}, `)
  }
 
  return (
    <>
      <Head>
        <title>aMessage</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={style.main}>
        <div className={style.main__user}>
          <div className={style.main__user_avatar}>
            <p>{Array.from(name)[0]}</p>
          </div>
          <span className={style.your_name}>{name}</span>
          <button onClick={toggleTheme} className={style.changeThemeBtn}>Change Theme</button>
        </div>

        
        <div className={style.messages_area}>
          <div className={style.input_area}>
            <form onSubmit={handleSubmit}>
              <input placeholder='Type your message here' value = {text} onChange = {(e) => {setText(e.target.value)}} maxLength={115}/>
              <div className='message_send'>{
                <button type='submit'>
                  <img src={send.src} width={30} height={30} />
                </button>
              }</div>
            </form>
          
          </div>
          <ul>
            {messages.sort((a,b) => {return b.id - a.id}).map(({id,text,name, date}, index)=> {
              const newdate = new Date(date);
              const correctDate = checkingDate(newdate.getDate()) + '/' + checkingDate((newdate.getMonth() + 1)) + ' ' + checkingDate(newdate.getHours()) + ':' + checkingDate(newdate.getMinutes());
              return (
                <div className={style.message}>
                  <li key = {index}>
                    <div className={style.user__message_wrapper}>
                      <div className={style.user_avatar}>
                        <p>{Array.from(name)[0]}</p>
                      </div>

                      <div className='user__message_name'>
                        <span>{name}</span>
                      </div>

                      <div className={style.user__message_text}>
                        {text}
                      </div>

                      <div className={style.user__message_date}>
                        {correctDate}
                      </div>     
                    </div>
                    <button onClick={() => showAnswerBtn(name)} className={style.user__message_answerBtn}>Answer</button>
                  </li>
                </div>
              ) 
              })}
          </ul>
        </div>
      </main>
    </>
  )
}