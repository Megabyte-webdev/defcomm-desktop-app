import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import DashTabs from '../components/dashboard/DashTabs'

const DashboardLayout = () => {
 
  return (
    <div className="bg-transparent">

    {/* Main Content */}
    <div className="flex-1 flex flex-col">
      {/* Tabs */}
      <div className="mt-10 p-0 md:p-6">
        <DashTabs />
      </div>

      {/* Content Area */}
      <main className="flex-1 p-0 py-3 md:p-6">
        <Outlet />

        
      </main>
    </div>
  </div>
  )
}

export default DashboardLayout
