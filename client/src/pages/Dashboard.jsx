import React, { useEffect, useState } from 'react'
// import {useLocation} from 'react-router-dom'
import { DashProfile } from '../components/DashProfile'
import DashsideBar from '../components/DashsideBar'

export const Dashboard = () => {
  // const location = useLocation()
  // const [tab, setTab] = useState('')
  // useEffect(()=>{
  //   const urlParams = new URLSearchParams(location.search)
  //   const tabFromUrl = urlParams.get('tab')
  //   if(tabFromUrl){
  //     setTab(tabFromUrl)
  //   }
    
  // },[location.search])
  return (
    <div>
      <div>
      {/* Sidebar */}
    
      {/* <DashsideBar/> */}
      </div>
      {/* profile */}
      {/* {tab === 'profile' && <DashProfile/>} */}
    </div>
  )
}
