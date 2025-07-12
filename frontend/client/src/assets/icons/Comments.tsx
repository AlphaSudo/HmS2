// <header className="h-24 px-8 flex items-center justify-between border-b border-[#5D0A72]/10">
//   {/* Header Title with icon and sidebar toggle */}
//   <div className="flex items-center gap-3">
//     {/* Sidebar toggle button */}
//     <button
//       onClick={() => setSidebarOpen(!sidebarOpen)}
//       className="w-10 h-10 flex items-center justify-center bg-[#05002E] rounded-lg shadow-md transition-all hover:bg-[#0A004A]/20"
//     >
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <line x1="3" y1="12" x2="21" y2="12" />
//         <line x1="3" y1="6" x2="21" y2="6" />
//         <line x1="3" y1="18" x2="21" y2="18" />
//       </svg>
//     </button>

//     <div className="w-10 h-10 flex items-center justify-center bg-[#05002E] rounded-lg shadow-md">
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <rect x="3" y="3" width="7" height="7" />
//         <rect x="14" y="3" width="7" height="7" />
//         <rect x="14" y="14" width="7" height="7" />
//         <rect x="3" y="14" width="7" height="7" />
//       </svg>
//     </div>
//     <span className="text-[#94A3B8] font-semibold text-lg">Dashboard</span>
//   </div>

//   {/* Search and user menu */}
//   <div className="flex items-center gap-5">
//     <div className="relative">
//       <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#94A3B8]/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//           <circle cx="11" cy="11" r="8" />
//           <line x1="21" y1="21" x2="16.65" y2="16.65" />
//         </svg>
//       </div>
//       <input
//         type="text"
//         placeholder="Search"
//         className="bg-[#05002E] w-72 text-sm py-2.5 pl-12 pr-4 rounded-xl text-[#94A3B8] placeholder-[#94A3B8]/50 focus:outline-none focus:ring-2 focus:ring-[#5D0A72]/50 border border-[#5D0A72]/10"
//       />
//     </div>

//     {/* Full Screen Button */}
//     <button
//       onClick={() => {
//         if (!document.fullscreenElement) {
//           document.documentElement.requestFullscreen();
//         } else if (document.exitFullscreen) {
//           document.exitFullscreen();
//         }
//       }}
//       className="w-11 h-11 flex items-center justify-center rounded-full bg-[#05002E] border border-[#5D0A72]/10 shadow-md hover:bg-[#0A004A]/20 transition-colors"
//     >
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <polyline points="15 3 21 3 21 9" />
//         <polyline points="9 21 3 21 3 15" />
//         <line x1="21" y1="3" x2="14" y2="10" />
//         <line x1="3" y1="21" x2="10" y2="14" />
//       </svg>
//     </button>

//     {/* Notification Button */}
//     <div className="w-11 h-11 flex items-center justify-center rounded-full bg-[#05002E] border border-[#5D0A72]/10 shadow-md">
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
//         <path d="M13.73 21a2 2 0 0 1-3.46 0" />
//       </svg>
//     </div>

//     {/* Language Selector - with flags */}
//     <button
//       onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
//       className="w-11 h-11 flex items-center justify-center rounded-full bg-[#05002E] border border-[#5D0A72]/10 shadow-md hover:bg-[#0A004A]/20 transition-colors overflow-hidden p-0"
//     >
//       {language === 'en' ? (
//         <div className="flex items-center justify-center w-full h-full">
//           {/* UK Flag */}
// <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="w-7 h-7">
//   <clipPath id="a"><path d="M0 0v30h60V0z"/></clipPath>
//   <clipPath id="b"><path d="M30 15h30v15zv15H0zH0V0zV0h30z"/></clipPath>
//   <g clipPath="url(#a)">
//     <path d="M0 0v30h60V0z" fill="#012169"/>
//     <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6"/>
//     <path d="M0 0l60 30m0-30L0 30" clipPath="url(#b)" stroke="#C8102E" strokeWidth="4"/>
//     <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10"/>
//     <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6"/>
//   </g>
// </svg>
//         </div>
//       ) : (
//         <div className="flex items-center justify-center w-full h-full">
//           {/* Egypt Flag */}
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" className="w-7 h-7">
//             <path fill="#CE1126" d="M0 0h900v600H0z"/>
//             <path fill="#FFF" d="M0 0h900v400H0z"/>
//             <path d="M0 0h900v200H0z"/>
//             <g fill="#C09300" transform="translate(450, 300)">
//               <path d="M-39.6 40.8s66-28.8 79.2 0C39.6 40.8-12 12-39.6 40.8z"/>
//               <path d="M-36 31.2s57.6-28.8 72 0c-36-31.2-36-31.2-72 0z"/>
//               <path d="M-26.4 24s45.6-21.6 52.8 0c-24-24-52.8 0-52.8 0z"/>
//               <path d="M-33.6-43.2c-15.6 15.6-8.4 48 7.2 64.8 12 13.2 38.4 31.2 38.4 31.2S18.2 36.9 4.4 19.7C-9.4 2.5-19.8-18.9-14.6-35.3c6-19.2-4.8-22.8-19.2-7.2z"/>
//               <path d="M-24-28.8c0 16.8 15.6 38.4 26.4 48 10.8 9.6 31.2 19.2 31.2 19.2s-25.2-21.6-36-38.4C-12.6-16.8-12-44.4-24-28.8z"/>
//             </g>
//           </svg>
//         </div>
//       )}
//     </button>

// {/* User Profile */}
// <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#5D0A72]/20 shadow-xl">
//   <img
//     src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&h=200&auto=format&fit=crop"
//     alt="Profile"
//     className="w-full h-full object-cover"
//   />
// </div>
//   </div>
// </header>

// <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-auto">
//          <div ref={formModalRef} className="bg-[#020120] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//            <div className="flex items-center justify-between px-6 py-4 border-b border-[#5D0A72]/20">
//              <div className="flex items-center gap-3">
//                <div className="w-10 h-10 rounded-full bg-[#5D0A72]/30 flex items-center justify-center overflow-hidden">
//                  <svg
//                    xmlns="http://www.w3.org/2000/svg"
//                    className="h-6 w-6 text-[#94A3B8]"
//                    viewBox="0 0 24 24"
//                    fill="none"
//                    stroke="currentColor"
//                    strokeWidth="2"
//                    strokeLinecap="round"
//                    strokeLinejoin="round"
//                  >
//                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
//                    <circle cx="12" cy="7" r="4"></circle>
//                  </svg>
//                </div>
//                <h2 className="text-white text-lg font-medium">
//                  {isEditMode ? "Edit Appointment" : "New Appointment"}
//                </h2>
//              </div>
//              <button
//                onClick={handleFormClose}
//                className="text-[#94A3B8] hover:text-white transition-colors"
//              >
//                <svg
//                  xmlns="http://www.w3.org/2000/svg"
//                  className="h-6 w-6"
//                  viewBox="0 0 24 24"
//                  fill="none"
//                  stroke="currentColor"
//                  strokeWidth="2"
//                  strokeLinecap="round"
//                  strokeLinejoin="round"
//                >
//                  <line x1="18" y1="6" x2="6" y2="18"></line>
//                  <line x1="6" y1="6" x2="18" y2="18"></line>
//                </svg>
//              </button>
//            </div>

//            <form onSubmit={handleSubmitForm} className="p-6 space-y-6">
//              {/* Name and Email */}
//              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                <div className="space-y-2">
//                  <label
//                    htmlFor="patientName"
//                    className="block text-[#94A3B8] text-sm font-medium"
//                  >
//                    Name*
//                  </label>
//                  <div className="relative">
//                    <input
//                      type="text"
//                      id="patientName"
//                      name="patientName"
//                      value={formData.patientName}
//                      onChange={handleFormInputChange}
//                      required
//                      className="bg-[#03001C] w-full px-4 py-3 rounded-lg text-white border border-[#5D0A72]/30 focus:outline-none focus:ring-1 focus:ring-[#5D0A72]/50"
//                    />
//                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#94A3B8]">
//                      <svg
//                        xmlns="http://www.w3.org/2000/svg"
//                        className="h-5 w-5"
//                        viewBox="0 0 24 24"
//                        fill="none"
//                        stroke="currentColor"
//                        strokeWidth="2"
//                        strokeLinecap="round"
//                        strokeLinejoin="round"
//                      >
//                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
//                        <circle cx="12" cy="7" r="4"></circle>
//                      </svg>
//                    </div>
//                  </div>
//                </div>
//                <div className="space-y-2">
//                  <label
//                    htmlFor="email"
//                    className="block text-[#94A3B8] text-sm font-medium"
//                  >
//                    Email*
//                  </label>
//                  <div className="relative">
//                    <input
//                      type="email"
//                      id="email"
//                      name="email"
//                      value={formData.email}
//                      onChange={handleFormInputChange}
//                      required
//                      className="bg-[#03001C] w-full px-4 py-3 rounded-lg text-white border border-[#5D0A72]/30 focus:outline-none focus:ring-1 focus:ring-[#5D0A72]/50"
//                    />
//                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#94A3B8]">
//                      <svg
//                        xmlns="http://www.w3.org/2000/svg"
//                        className="h-5 w-5"
//                        viewBox="0 0 24 24"
//                        fill="none"
//                        stroke="currentColor"
//                        strokeWidth="2"
//                        strokeLinecap="round"
//                        strokeLinejoin="round"
//                      >
//                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
//                        <polyline points="22,6 12,13 2,6"></polyline>
//                      </svg>
//                    </div>
//                  </div>
//                </div>
//              </div>

//              {/* Gender */}
//              <div className="space-y-2">
//                <label className="block text-[#94A3B8] text-sm font-medium">
//                  Gender:
//                </label>
//                <div className="flex items-center space-x-4">
//                  <div className="flex items-center">
//                    <input
//                      id="gender-male"
//                      type="radio"
//                      checked={formData.gender === "male"}
//                      onChange={() => handleGenderChange("male")}
//                      className="w-4 h-4 text-[#5D0A72] border-[#5D0A72]/30 focus:ring-[#5D0A72]/50"
//                    />
//                    <label
//                      htmlFor="gender-male"
//                      className="ml-2 text-[#94A3B8]"
//                    >
//                      Male
//                    </label>
//                  </div>
//                  <div className="flex items-center">
//                    <input
//                      id="gender-female"
//                      type="radio"
//                      checked={formData.gender === "female"}
//                      onChange={() => handleGenderChange("female")}
//                      className="w-4 h-4 text-[#5D0A72] border-[#5D0A72]/30 focus:ring-[#5D0A72]/50"
//                    />
//                    <label
//                      htmlFor="gender-female"
//                      className="ml-2 text-[#94A3B8]"
//                    >
//                      Female
//                    </label>
//                  </div>
//                </div>
//              </div>

//              {/* Date and Time */}
//              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                <div className="space-y-2">
//                  <label
//                    htmlFor="date"
//                    className="block text-[#94A3B8] text-sm font-medium"
//                  >
//                    Choose a date*
//                  </label>
//                  <div className="relative">
//                    <input
//                      type="text"
//                      id="date"
//                      name="date"
//                      value={formData.date}
//                      onChange={handleFormInputChange}
//                      required
//                      placeholder="MM/DD/YYYY"
//                      className="bg-[#03001C] w-full px-4 py-3 rounded-lg text-white border border-[#5D0A72]/30 focus:outline-none focus:ring-1 focus:ring-[#5D0A72]/50"
//                    />
//                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#94A3B8]">
//                      <svg
//                        xmlns="http://www.w3.org/2000/svg"
//                        className="h-5 w-5"
//                        viewBox="0 0 24 24"
//                        fill="none"
//                        stroke="currentColor"
//                        strokeWidth="2"
//                        strokeLinecap="round"
//                        strokeLinejoin="round"
//                      >
//                        <rect
//                          x="3"
//                          y="4"
//                          width="18"
//                          height="18"
//                          rx="2"
//                          ry="2"
//                        ></rect>
//                        <line x1="16" y1="2" x2="16" y2="6"></line>
//                        <line x1="8" y1="2" x2="8" y2="6"></line>
//                        <line x1="3" y1="10" x2="21" y2="10"></line>
//                      </svg>
//                    </div>
//                  </div>
//                </div>
//                <div className="space-y-2">
//                  <label
//                    htmlFor="time"
//                    className="block text-[#94A3B8] text-sm font-medium"
//                  >
//                    Time*
//                  </label>
//                  <div className="relative">
//                    <input
//                      type="text"
//                      id="time"
//                      name="time"
//                      value={formData.time}
//                      onChange={handleFormInputChange}
//                      required
//                      placeholder="HH:MM"
//                      className="bg-[#03001C] w-full px-4 py-3 rounded-lg text-white border border-[#5D0A72]/30 focus:outline-none focus:ring-1 focus:ring-[#5D0A72]/50"
//                    />
//                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#94A3B8]">
//                      <svg
//                        xmlns="http://www.w3.org/2000/svg"
//                        className="h-5 w-5"
//                        viewBox="0 0 24 24"
//                        fill="none"
//                        stroke="currentColor"
//                        strokeWidth="2"
//                        strokeLinecap="round"
//                        strokeLinejoin="round"
//                      >
//                        <circle cx="12" cy="12" r="10"></circle>
//                        <polyline points="12 6 12 12 16 14"></polyline>
//                      </svg>
//                    </div>
//                  </div>
//                </div>
//              </div>

//              {/* Mobile and Doctor Name */}
//              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                <div className="space-y-2">
//                  <label
//                    htmlFor="phone"
//                    className="block text-[#94A3B8] text-sm font-medium"
//                  >
//                    Mobile*
//                  </label>
//                  <div className="relative">
//                    <input
//                      type="tel"
//                      id="phone"
//                      name="phone"
//                      value={formData.phone}
//                      onChange={handleFormInputChange}
//                      required
//                      className="bg-[#03001C] w-full px-4 py-3 rounded-lg text-white border border-[#5D0A72]/30 focus:outline-none focus:ring-1 focus:ring-[#5D0A72]/50"
//                    />
//                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#94A3B8]">
//                      <svg
//                        xmlns="http://www.w3.org/2000/svg"
//                        className="h-5 w-5"
//                        viewBox="0 0 24 24"
//                        fill="none"
//                        stroke="currentColor"
//                        strokeWidth="2"
//                        strokeLinecap="round"
//                        strokeLinejoin="round"
//                      >
//                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
//                      </svg>
//                    </div>
//                  </div>
//                </div>
//                <div className="space-y-2">
//                  <label
//                    htmlFor="doctor"
//                    className="block text-[#94A3B8] text-sm font-medium"
//                  >
//                    Doctor Name*
//                  </label>
//                  <div className="relative">
//                    <select
//                      id="doctor"
//                      name="doctor"
//                      value={formData.doctor}
//                      onChange={handleFormInputChange}
//                      required
//                      className="bg-[#03001C] w-full px-4 py-3 rounded-lg text-white border border-[#5D0A72]/30 focus:outline-none focus:ring-1 focus:ring-[#5D0A72]/50 appearance-none"
//                    >
//                      <option value="">Select Doctor</option>
//                      <option value="Dr.Jay Soni">Dr. Jay Soni</option>
//                      <option value="Dr.Sarah Smith">Dr. Sarah Smith</option>
//                      <option value="Dr.Rajesh">Dr. Rajesh</option>
//                      <option value="Dr.Pooja Patel">Dr. Pooja Patel</option>
//                    </select>
//                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#94A3B8]">
//                      <svg
//                        xmlns="http://www.w3.org/2000/svg"
//                        className="h-5 w-5"
//                        viewBox="0 0 24 24"
//                        fill="none"
//                        stroke="currentColor"
//                        strokeWidth="2"
//                        strokeLinecap="round"
//                        strokeLinejoin="round"
//                      >
//                        <path d="M6 9l6 6 6-6" />
//                      </svg>
//                    </div>
//                  </div>
//                </div>
//              </div>

//              {/* Injury/Condition */}
//              <div className="space-y-2">
//                <label
//                  htmlFor="issue"
//                  className="block text-[#94A3B8] text-sm font-medium"
//                >
//                  Injury/Condition
//                </label>
//                <textarea
//                  id="issue"
//                  name="issue"
//                  rows={3}
//                  value={formData.issue}
//                  onChange={handleFormInputChange}
//                  className="bg-[#03001C] w-full px-4 py-3 rounded-lg text-white border border-[#5D0A72]/30 focus:outline-none focus:ring-1 focus:ring-[#5D0A72]/50"
//                ></textarea>
//              </div>

//              {/* Appointment Status and Visit Type */}
//              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                <div className="space-y-2">
//                  <label
//                    htmlFor="status"
//                    className="block text-[#94A3B8] text-sm font-medium"
//                  >
//                    Appointment Status
//                  </label>
//                  <div className="relative">
//                    <select
//                      id="status"
//                      name="status"
//                      value={formData.status}
//                      onChange={handleFormInputChange}
//                      className="bg-[#03001C] w-full px-4 py-3 rounded-lg text-white border border-[#5D0A72]/30 focus:outline-none focus:ring-1 focus:ring-[#5D0A72]/50 appearance-none"
//                    >
//                      <option value="Scheduled">Scheduled</option>
//                      <option value="Completed">Completed</option>
//                      <option value="Cancelled">Cancelled</option>
//                    </select>
//                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#94A3B8]">
//                      <svg
//                        xmlns="http://www.w3.org/2000/svg"
//                        className="h-5 w-5"
//                        viewBox="0 0 24 24"
//                        fill="none"
//                        stroke="currentColor"
//                        strokeWidth="2"
//                        strokeLinecap="round"
//                        strokeLinejoin="round"
//                      >
//                        <path d="M6 9l6 6 6-6" />
//                      </svg>
//                    </div>
//                  </div>
//                </div>
//                <div className="space-y-2">
//                  <label
//                    htmlFor="visitType"
//                    className="block text-[#94A3B8] text-sm font-medium"
//                  >
//                    Visit Type
//                  </label>
//                  <div className="relative">
//                    <select
//                      id="visitType"
//                      name="visitType"
//                      value={formData.visitType}
//                      onChange={handleFormInputChange}
//                      className="bg-[#03001C] w-full px-4 py-3 rounded-lg text-white border border-[#5D0A72]/30 focus:outline-none focus:ring-1 focus:ring-[#5D0A72]/50 appearance-none"
//                    >
//                      <option value="New Patient">New Patient</option>
//                      <option value="Follow-Up">Follow-Up</option>
//                    </select>
//                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#94A3B8]">
//                      <svg
//                        xmlns="http://www.w3.org/2000/svg"
//                        className="h-5 w-5"
//                        viewBox="0 0 24 24"
//                        fill="none"
//                        stroke="currentColor"
//                        strokeWidth="2"
//                        strokeLinecap="round"
//                        strokeLinejoin="round"
//                      >
//                        <path d="M6 9l6 6 6-6" />
//                      </svg>
//                    </div>
//                  </div>
//                </div>
//              </div>

//              {/* Form Buttons */}
//              <div className="flex justify-end gap-3 pt-4">
//                <button
//                  type="button"
//                  onClick={handleFormClose}
//                  className="px-6 py-2 bg-[#494949] text-white rounded-lg hover:bg-[#5D5D5D] transition-colors"
//                >
//                  Cancel
//                </button>
//                <button
//                  type="submit"
//                  className="px-6 py-2 bg-[#E53E3E] text-white rounded-lg hover:bg-[#C53030] transition-colors"
//                >
//                  Save
//                </button>
//              </div>
//            </form>
//          </div>
//        </div>

// const handleFormInputChange = (
//    e: React.ChangeEvent<
//      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//    >,
//  ) => {
//    const { name, value } = e.target;
//    setFormData((prev) => ({ ...prev, [name]: value }));
//  };

//  const handleGenderChange = (gender: "male" | "female") => {
//    setFormData((prev) => ({ ...prev, gender }));
//  };

//  const handleSubmitForm = (e: React.FormEvent) => {
//    e.preventDefault();
//    handleFormSubmit(formData);
//  };

// <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
//           <div ref={deleteModalRef} className="bg-[#020120] rounded-lg w-full max-w-md p-6">
//             <div className="text-center mb-6">
//               <div className="flex justify-center mb-4">
//                 <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-8 w-8 text-red-600"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <path d="M18 6L6 18M6 6l12 12"></path>
//                   </svg>
//                 </div>
//               </div>
//               <h3 className="text-xl font-medium text-white mb-2">
//                 Delete Appointment
//               </h3>
//               <p className="text-[#94A3B8]">
//                 Are you sure you want to delete this appointment? This action
//                 cannot be undone.
//               </p>
//             </div>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={handleCancelDelete}
//                 className="px-6 py-2 bg-[#494949] text-white rounded-lg hover:bg-[#5D5D5D] transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmDelete}
//                 className="px-6 py-2 bg-[#E53E3E] text-white rounded-lg hover:bg-[#C53030] transition-colors"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>

{
  /* <div className="flex items-center text-sm text-[#94A3B8]/70 mb-2">
    <span>View Appointments</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 mx-2"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
    <span>Appointment</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 mx-2"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
    <span>View</span> */
}
{
  /* </div> */
}

// import SortableHeader from "@/components/ui/SortableHeader";
// <div
//   style={{
//     padding: "2px",
//     borderRadius: "1rem", // Equivalent to rounded-2xl
//     background:
//       "conic-gradient(#072f93 0deg, #03115e 45deg, #031b78 90deg, #0f42c1 135deg, #021a70 180deg, #031a63 225deg, #0a70d2 270deg, #0e82ea 315deg, #072f93 360deg)",
//     display: "grid",
//     boxShadow: `
//       0 4px 8px rgba(7, 47, 147, 0.3),         /* Outer shadow - subtle blue glow */
//       0 0 12px rgba(14, 130, 234, 0.4),         /* Outer glow - more intense */

//     `,
//   }}
// >
//   <div
//     className="bg-[#05002E] rounded-xl overflow-hidden shadow-lg "
//     style={{
//       boxShadow: `inset 0 2px 4px rgba(3, 17, 94, 0.6),     /* Inset shadow - top */
//   inset 0 -2px 6px rgba(2, 26, 112, 0.8)    /* Inset shadow - bottom */`,
//     }}
//   >
//     {/* Table Header */}

//     <div className="p-5 flex items-center justify-between border-b border-[#5D0A72]/10  ">
//       <div className="flex items-center gap-2">
//         <div className="relative w-64">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-4 w-4 text-[#94A3B8]/70"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <circle cx="11" cy="11" r="8" />
//               <line x1="21" y1="21" x2="16.65" y2="16.65" />
//             </svg>
//           </div>
//           <input
//             type="text"
//             placeholder="Search"
//             className="bg-[#02001E] text-sm py-2 pl-10 pr-4 rounded-lg text-[#94A3B8] placeholder-[#94A3B8]/50 focus:outline-none focus:ring-1 focus:ring-[#5D0A72]/50 border border-[#5D0A72]/10 w-full"
//           />
//         </div>
//       </div>

//       {/* Table Actions */}
//       <div className="flex items-center gap-2">
//         {/* Delete Selected - only shows when items are selected */}
//         {selectedAppointments.length > 0 && (
//           <div className="relative parent-container">
//             <button
//               onClick={handleBulkDelete}
//               className="relative bg-[#450A0A] text-white p-2 rounded-lg hover:bg-[#5A0000] transition-colors border border-red-700/40 group"
//             >
//               <span className="absolute invisible group-hover:visible bg-[#450A0A] text-white text-xs px-2 py-1 rounded-lg -bottom-full left-1/2 transform -translate-x-1/2 z-50">
//                 Delete {selectedAppointments.length} Selected
//               </span>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M3 6h18" />
//                 <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
//                 <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
//                 <line x1="10" y1="11" x2="10" y2="17" />
//                 <line x1="14" y1="11" x2="14" y2="17" />
//               </svg>
//             </button>
//           </div>
//         )}

//         {/* Refresh Table Button */}
//         <div className="relative parent-container">
//           <button
//             onClick={handleRefreshTable}
//             className="relative bg-[#05002E] text-[#94A3B8] p-2 rounded-lg hover:bg-[#0A004A]/20 transition-colors border border-[#5D0A72]/10 group"
//           >
//             <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-full left-1/2 transform -translate-x-1/2 z-50">
//               Refresh Table
//             </span>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
//               <path d="M21 3v5h-5" />
//               <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
//               <path d="M8 16H3v5" />
//             </svg>
//           </button>
//         </div>

//         {/* XLSX Export Button */}
//         <div className="relative parent-container">
//           <button
//             onClick={handleXlsxDownload}
//             className="relative bg-[#05002E] text-[#94A3B8] p-2 rounded-lg hover:bg-[#0A004A]/20 transition-colors border border-[#5D0A72]/10 group"
//           >
//             <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-full left-1/2 transform -translate-x-1/2 z-50">
//               Export to Excel
//             </span>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
//               <polyline points="14 2 14 8 20 8" />
//               <path d="M8 13h2" />
//               <path d="M8 17h2" />
//               <path d="M14 13h2" />
//               <path d="M14 17h2" />
//             </svg>
//           </button>
//         </div>

//         {/* Show/Hide Columns Button */}
//         <div className="relative parent-container">
//           <button
//             onClick={() => setShowColumnSelector(!showColumnSelector)}
//             className="relative bg-[#05002E] text-[#94A3B8] p-2 rounded-lg hover:bg-[#0A004A]/20 transition-colors border border-[#5D0A72]/10 group"
//           >
//             <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-full left-1/2 transform -translate-x-1/2 z-50">
//               Show/Hide Columns
//             </span>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               viewBox="0 0 24 24"
//               fill="currentColor"
//             >
//               <path
//                 fillRule="evenodd"
//                 clipRule="evenodd"
//                 d="M3 7C3 6.44772 3.44772 6 4 6H20C20.5523 6 21 6.44772 21 7C21 7.55228 20.5523 8 20 8H4C3.44772 8 3 7.5523 3 7ZM6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12ZM9 17C9 16.4477 9.44772 16 10 16H14C14.5523 16 15 16.4477 15 17C15 17.5523 14.5523 18 14 18H10C9.44772 18 9 17.5523 9 17Z"
//                 fill="currentColor"
//               />
//             </svg>
//           </button>

//           {/* Column Selector Popup */}
//           {showColumnSelector && (
//             <div
//               ref={columnSelectorRef}
//               className="absolute top-12 right-0 z-30 w-64 bg-[#f2f2f4] rounded-lg shadow-lg border border-[#5D0A72]/10 overflow-hidden"
//               style={{ maxHeight: "400px", overflowY: "auto" }}
//             >
//               <div className="sticky top-0 bg-[#e9eaec] p-3 border-b border-gray-300">
//                 <h3 className="text-gray-700 font-medium text-base">
//                   Show/Hide Column
//                 </h3>
//               </div>
//               <div className="overflow-y-auto">
//                 {columns.map((column) => (
//                   <div
//                     key={column.id}
//                     className="flex items-center px-4 py-3 hover:bg-gray-100 border-b border-gray-200"
//                   >
//                     <input
//                       type="checkbox"
//                       id={`column-${column.id}`}
//                       checked={column.visible}
//                       onChange={() =>
//                         toggleColumnVisibility(column.id)
//                       }
//                       className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                     />
//                     <label
//                       htmlFor={`column-${column.id}`}
//                       className="ml-3 text-sm text-gray-700 cursor-pointer"
//                     >
//                       {column.label}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Add New Button */}
//         <div className="relative parent-container">
//           <button
//             onClick={handleAddClick}
//             className="relative bg-[#05002E] text-[#94A3B8] p-2 rounded-lg hover:bg-[#0A004A]/20 transition-colors border border-[#5D0A72]/10 group"
//           >
//             <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-full left-1/2 transform -translate-x-1/2 z-50">
//               Add New Appointment
//             </span>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               viewBox="0 0 24 24"
//               fill="none"
//             >
//               <circle
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="1.5"
//               />
//               <path
//                 d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
//                 stroke="currentColor"
//                 strokeWidth="1.5"
//                 strokeLinecap="round"
//               />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </div>

//     {/* Table */}
//     <div className="overflow-x-auto p-4 bg-[#05002E] ">
//       {/* //#03001c          */}

//       <table className="w-full   bg-[#05002E] ">
//         <thead>
//           <tr className="text-left text-[#94A3B8]   bg-[#03001c] ">
//             <th className="py-4 px-6 font-medium rounded-l-lg">
//               <div className="flex items-center ">
//                 <input
//                   type="checkbox"
//                   checked={selectAll}
//                   onChange={handleSelectAll}
//                   className="rounded border-[#5D0A72]/30 text-[#5D0A72] focus:ring-[#5D0A72]/30 h-4 w-4"
//                 />
//               </div>
//             </th>
//             {columns.find((c) => c.id === "name")?.visible && (

//               <SortableHeader
//                 label="Name"
//                 columnKey="patientName"
//                 sortColumn={sortColumn}
//                 sortOrder={sortOrder}
//                 onSort={handleSortClick}
//               />
//             )}
//             {columns.find((c) => c.id === "doctor")?.visible && (

//               <SortableHeader
//                 label="Doctor"
//                 columnKey="doctor"
//                 sortColumn={sortColumn}
//                 sortOrder={sortOrder}
//                 onSort={handleSortClick}
//               />
//             )}
//             {columns.find((c) => c.id === "gender")?.visible && (
//               <SortableHeader
//                 label="Gender"
//                 columnKey="gender"
//                 sortColumn={sortColumn}
//                 sortOrder={sortOrder}
//                 onSort={handleSortClick}
//               />
//             )}
//             {columns.find((c) => c.id === "date")?.visible && (
//               <SortableHeader
//                 label="Date"
//                 columnKey="date"
//                 sortColumn={sortColumn}
//                 sortOrder={sortOrder}
//                 onSort={handleSortClick}
//               />
//             )}
//             {columns.find((c) => c.id === "time")?.visible && (
//               <SortableHeader
//                 label="Time"
//                 columnKey="time"
//                 sortColumn={sortColumn}
//                 sortOrder={sortOrder}
//                 onSort={handleSortClick}
//               />
//             )}
//             {columns.find((c) => c.id === "mobile")?.visible && (
//               <th className="py-4 px-6 font-medium">Mobile</th>
//             )}
//             {columns.find((c) => c.id === "injury")?.visible && (
//               <SortableHeader
//                 label="Injury"
//                 columnKey="injury"
//                 sortColumn={sortColumn}
//                 sortOrder={sortOrder}
//                 onSort={handleSortClick}
//               />
//             )}
//             {columns.find((c) => c.id === "email")?.visible && (
//               <th className="py-4 px-6 font-medium">Email</th>
//             )}
//             {columns.find((c) => c.id === "status")?.visible && (
//               <SortableHeader
//                 label="Status"
//                 columnKey="status"
//                 sortColumn={sortColumn}
//                 sortOrder={sortOrder}
//                 onSort={handleSortClick}
//               />
//             )}
//             {columns.find((c) => c.id === "visitType")?.visible && (
//               <SortableHeader
//                 label="Visit Type"
//                 columnKey="visitType"
//                 sortColumn={sortColumn}
//                 sortOrder={sortOrder}
//                 onSort={handleSortClick}
//               />
//             )}
//             <th className="py-4 px-6 font-medium rounded-r-lg">
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-[#5D0A72]/10">
//           {currentAppointments.map((appointment) => (
//             <tr
//               key={appointment.id}
//               className="text-[#94A3B8] hover:bg-[#02001e]/30 transition-colors even:bg-[#000041] cursor-pointer"
//               onClick={(e) => {
//                 // Don't trigger edit if checkbox is clicked
//                 if ((e.target as HTMLElement).closest('input[type="checkbox"]') ||
//                     (e.target as HTMLElement).closest('button')) {
//                   return;
//                 }
//                 handleEditClick(appointment);
//               }}
//             >
//               <td className="py-4 px-6">
//                 <input
//                   type="checkbox"
//                   checked={selectedAppointments.includes(
//                     appointment.id,
//                   )}
//                   onChange={() =>
//                     handleSelectAppointment(appointment.id)
//                   }
//                   className="rounded border-[#5D0A72]/30 text-[#5D0A72] focus:ring-[#5D0A72]/30 h-4 w-4"
//                 />
//               </td>
//               {columns.find((c) => c.id === "name")?.visible && (
//                 <td className="py-4 px-6">
//                   <div className="flex items-center gap-3">
//                     <div
//                       className={`w-10 h-10 rounded-full flex items-center justify-center ${getAvatarBg(appointment.gender)}`}
//                     >
//                       <span className="text-sm font-medium">
//                         {appointment.patientName
//                           .split(" ")
//                           .map((n) => n[0])
//                           .join("")}
//                       </span>
//                     </div>
//                     <div className="relative group">
//                       <span className="truncate block max-w-[150px]">{appointment.patientName}</span>
//                       <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-8 left-0 z-50 whitespace-nowrap">
//                         {appointment.patientName}
//                       </span>
//                     </div>
//                   </div>
//                 </td>
//               )}
//               {columns.find((c) => c.id === "doctor")?.visible && (
//                 <td className="py-4 px-6">
//                   <div className="relative group">
//                     <span className="truncate block max-w-[150px]">{appointment.doctor}</span>
//                     <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-8 left-0 z-50 whitespace-nowrap">
//                       {appointment.doctor}
//                     </span>
//                   </div>
//                 </td>
//               )}
//               {columns.find((c) => c.id === "gender")?.visible && (
//                 <td className="py-4 px-6">
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-medium ${
//                       appointment.gender === "female"
//                         ? "bg-pink-100 text-pink-800"
//                         : "bg-blue-100 text-blue-800"
//                     }`}
//                   >
//                     {appointment.gender}
//                   </span>
//                 </td>
//               )}
//               {columns.find((c) => c.id === "date")?.visible && (
//                 <td className="py-4 px-6">
//                   <div className="relative group">
//                     <span className="truncate block max-w-[120px]">{appointment.date}</span>
//                     <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-8 left-0 z-50 whitespace-nowrap">
//                       {appointment.date}
//                     </span>
//                   </div>
//                 </td>
//               )}
//               {columns.find((c) => c.id === "time")?.visible && (
//                 <td className="py-4 px-6">
//                   <div className="flex items-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-4 w-4 mr-2 text-[#94A3B8]/70 flex-shrink-0"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <circle cx="12" cy="12" r="10" />
//                       <polyline points="12 6 12 12 16 14" />
//                     </svg>
//                     <div className="relative group">
//                       <span className="truncate block max-w-[100px]">{appointment.time}</span>
//                       <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-8 left-0 z-50 whitespace-nowrap">
//                         {appointment.time}
//                       </span>
//                     </div>
//                   </div>
//                 </td>
//               )}
//               {columns.find((c) => c.id === "mobile")?.visible && (
//                 <td className="py-4 px-6">
//                   <div className="flex items-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-4 w-4 mr-2 text-[#94A3B8]/70 flex-shrink-0"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
//                     </svg>
//                     <div className="relative group">
//                       <span className="truncate block max-w-[120px]">{appointment.phone}</span>
//                       <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-8 left-0 z-50 whitespace-nowrap">
//                         {appointment.phone}
//                       </span>
//                     </div>
//                   </div>
//                 </td>
//               )}
//               {columns.find((c) => c.id === "injury")?.visible && (
//                 <td className="py-4 px-6">
//                   <div className="relative group">
//                     <span className="truncate block max-w-[150px]">{appointment.issue}</span>
//                     <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-8 left-0 z-50 whitespace-nowrap">
//                       {appointment.issue}
//                     </span>
//                   </div>
//                 </td>
//               )}
//               {columns.find((c) => c.id === "email")?.visible && (
//                 <td className="py-4 px-6">
//                   <div className="flex items-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-4 w-4 mr-2 text-[#94A3B8]/70 flex-shrink-0"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
//                       <polyline points="22,6 12,13 2,6" />
//                     </svg>
//                     <div className="relative group">
//                       <span className="truncate block max-w-[150px]">{appointment.email}</span>
//                       <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-8 left-0 z-50 whitespace-nowrap">
//                         {appointment.email}
//                       </span>
//                     </div>
//                   </div>
//                 </td>
//               )}
//               {columns.find((c) => c.id === "status")?.visible && (
//                 <td className="py-4 px-6">
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}
//                   >
//                     {appointment.status}
//                   </span>
//                 </td>
//               )}
//               {columns.find((c) => c.id === "visitType")?.visible && (
//                 <td className="py-4 px-6">
//                   <div className="relative group">
//                     <span className="truncate block max-w-[150px]">{appointment.visitType}</span>
//                     <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-8 left-0 z-50 whitespace-nowrap">
//                       {appointment.visitType}
//                     </span>
//                   </div>
//                 </td>
//               )}
//               <td className="py-4 px-6">
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleEditClick(appointment);
//                     }}
//                     className="text-blue-500 hover:text-blue-700"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
//                       <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
//                     </svg>
//                   </button>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleDeleteClick(appointment.id);
//                     }}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <polyline points="3 6 5 6 21 6" />
//                       <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
//                     </svg>
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   </div>
// </div>

{
  /* Pagination */
}
// <div className="p-4 flex items-center justify-between border-t border-[#5D0A72]/10">
//   <div className="text-sm text-[#94A3B8]">
//     Items per page:
//     <select
//       className="ml-2 bg-[#02001E] border border-[#5D0A72]/20 rounded px-2 py-1 text-[#94A3B8]"
//       value={itemsPerPage}
//       onChange={handleItemsPerPageChange}
//     >
//       <option value="5">5</option>
//       <option value="10">10</option>
//       <option value="20">20</option>
//       <option value="50">50</option>
//     </select>
//   </div>
//   <div className="text-sm text-[#94A3B8]">
//     {indexOfFirstItem + 1}-
//     {Math.min(indexOfLastItem, sortedAppointments.length)} of{" "}
//     {sortedAppointments.length}
//   </div>
//   <div className="flex items-center gap-2">
//     <button
//       className={`p-1 rounded-md border border-[#5D0A72]/20 ${
//         currentPage === 1
//           ? "text-[#94A3B8]/30 cursor-not-allowed"
//           : "text-[#94A3B8] hover:bg-[#5D0A72]/10 cursor-pointer"
//       }`}
//       onClick={() =>
//         currentPage > 1 && handlePageChange(currentPage - 1)
//       }
//       disabled={currentPage === 1}
//     >
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="h-5 w-5"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <polyline points="15 18 9 12 15 6" />
//       </svg>
//     </button>

//     {/* Page numbers */}
//     <div className="flex items-center">
//       {Array.from({ length: Math.min(totalPages, 3) }).map(
//         (_, index) => {
//           // Show current page and 1 page before/after when possible
//           let pageNum;
//           if (totalPages <= 3) {
//             pageNum = index + 1;
//           } else if (currentPage <= 2) {
//             pageNum = index + 1;
//           } else if (currentPage >= totalPages - 1) {
//             pageNum = totalPages - 2 + index;
//           } else {
//             pageNum = currentPage - 1 + index;
//           }

//           return (
//             <button
//               key={pageNum}
//               onClick={() => handlePageChange(pageNum)}
//               className={`w-8 h-8 mx-1 rounded-md flex items-center justify-center ${
//                 currentPage === pageNum
//                   ? "bg-[#5D0A72]/30 text-white"
//                   : "text-[#94A3B8] hover:bg-[#5D0A72]/10"
//               }`}
//             >
//               {pageNum}
//             </button>
//           );
//         },
//       )}
//     </div>

//     <button
//       className={`p-1 rounded-md border border-[#5D0A72]/20 ${
//         currentPage === totalPages
//           ? "text-[#94A3B8]/30 cursor-not-allowed"
//           : "text-[#94A3B8] hover:bg-[#5D0A72]/10 cursor-pointer"
//       }`}
//       onClick={() =>
//         currentPage < totalPages && handlePageChange(currentPage + 1)
//       }
//       disabled={currentPage === totalPages}
//     >
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="h-5 w-5"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <polyline points="9 18 15 12 9 6" />
//       </svg>
//     </button>
//   </div>
// </div>


// import { useState, useRef, useEffect ,useMemo } from "react";
// import { Sidebar } from "@/components/ui/sidebar";
// import { Header } from "@/components/ui/Header";
// import { AppointmentFormModal } from "@/components/ui/AppointmentFormModal";
// import { DeleteConfirmationDialog } from "@/components/ui/DeleteConfirmationDialog";
// import AppointmentsIcon from "@/components/icons/AppointmentIcon";
// import { ChartGradients } from "@/lib/chart-gradients";
// import AppointmentsTableCard from "@/components/ui/AppointmentsTableCard";
// import { useToast } from "@/hooks/use-toast";
// import { Appointment, ColumnToggle } from "@/components/types/appointment";
// import { initialAppointments } from "@/components/data/initialAppointments";



// export default function AppointmentsPage() {
//   // Sidebar & Language
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [language, setLanguage] = useState<"en" | "ar">("en");

//   // Appointments Data
//   const [appointments, setAppointments] =
//     useState<Appointment[]>(initialAppointments);
//   const [selectedAppointments, setSelectedAppointments] = useState<number[]>(
//     [],
//   );

//   // Sorting & Pagination
//   const [sortColumn, setSortColumn] = useState<string | null>(null);
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);

//   // Form Management
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [currentAppointment, setCurrentAppointment] =
//     useState<Appointment | null>(null);

//   // Delete Dialog
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [appointmentToDelete, setAppointmentToDelete] = useState<number | null>(
//     null,
//   );

//   // Columns
//   const [columns, setColumns] = useState<ColumnToggle[]>([
//     { id: "name", label: "Name", visible: true },
//     { id: "doctor", label: "Doctor", visible: true },
//     { id: "gender", label: "Gender", visible: true },
//     { id: "date", label: "Date", visible: true },
//     { id: "time", label: "Time", visible: true },
//     { id: "mobile", label: "Mobile", visible: true },
//     { id: "injury", label: "Injury", visible: true },
//     { id: "email", label: "Email", visible: true },
//     { id: "status", label: "Appointment Status", visible: true },
//     { id: "visitType", label: "Visit Type", visible: true },
//   ]);
//   const [showColumnSelector, setShowColumnSelector] = useState(false);

//   //hooks
//   const { toast } = useToast();
//   //refs
//   const columnSelectorRef = useRef<HTMLDivElement>(null);
//   const formModalRef = useRef<HTMLDivElement>(null);
//   const deleteModalRef = useRef<HTMLDivElement>(null);

//   // Handle clicking outside to close column selector, form or delete dialog
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       // Close column selector if clicked outside
//       if (
//         columnSelectorRef.current &&
//         !columnSelectorRef.current.contains(event.target as Node)
//       ) {
//         setShowColumnSelector(false);
//       }

//       // Close form modal if clicked outside
//       if (
//         isFormOpen &&
//         formModalRef.current &&
//         !formModalRef.current.contains(event.target as Node)
//       ) {
//         handleFormClose();
//       }

//       // Close delete confirmation dialog if clicked outside
//       if (
//         isDeleteDialogOpen &&
//         deleteModalRef.current &&
//         !deleteModalRef.current.contains(event.target as Node)
//       ) {
//         handleCancelDelete();
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isFormOpen, isDeleteDialogOpen]);

//   const handleFormClose = () => {
//     setIsFormOpen(false);
//   };

//   const handleFormSubmit = (appointmentData: Partial<Appointment>) => {
//     if (isEditMode && currentAppointment) {
//       // Edit existing appointment
//       const updatedAppointments = appointments.map((appointment) =>
//         appointment.id === currentAppointment.id
//           ? { ...appointment, ...(appointmentData as Appointment) }
//           : appointment,
//       );

//       setAppointments(updatedAppointments);

//       toast({
//         title: "Appointment Updated",
//         description: `Appointment for ${appointmentData.patientName} has been successfully updated.`,
//         className: "bg-[#05002E] border border-[#5D0A72]/20 text-white",
//       });
//     } else {
//       // Add new appointment
//       const newAppointment = {
//         id: Math.max(...appointments.map((a) => a.id)) + 1,
//         ...appointmentData,
//       } as Appointment;

//       setAppointments([...appointments, newAppointment]);

//       toast({
//         title: "Appointment Created",
//         description: `New appointment for ${newAppointment.patientName} has been successfully created.`,
//         className: "bg-[#05002E] border border-[#5D0A72]/20 text-white",
//       });
//     }
//     setIsFormOpen(false);
//   };

//   const handleConfirmDelete = () => {
//     if (appointmentToDelete) {
//       // Get the appointment to be deleted
//       const appointmentToRemove = appointments.find(
//         (a) => a.id === appointmentToDelete,
//       );

//       // Filter out the appointment with matching ID
//       const updatedAppointments = appointments.filter(
//         (appointment) => appointment.id !== appointmentToDelete,
//       );

//       setAppointments(updatedAppointments);

//       // Show confirmation toast
//       toast({
//         title: "Appointment Deleted",
//         description: `Appointment for ${appointmentToRemove?.patientName || "patient"} has been successfully removed.`,
//         variant: "destructive",
//         className: "bg-[#450A0A] border border-red-700/50 text-white",
//       });
//     }
//     setIsDeleteDialogOpen(false);
//     setAppointmentToDelete(null);
//   };

//   const handleCancelDelete = () => {
//     setIsDeleteDialogOpen(false);
//     setAppointmentToDelete(null);
//   };



//   // Sort appointments
//   const sortedAppointments = useMemo(() => {
//     const sorted = [...appointments];

//     if (sortOrder === null || sortColumn === null) {
//       return sorted.sort((a, b) => a.id - b.id); // default sort
//     }

//     const sortMultiplier = sortOrder === "asc" ? 1 : -1;

//     return sorted.sort((a, b) => {
//       switch (sortColumn) {
//         case "id":
//           return sortMultiplier * (a.id - b.id);
//         case "patientName":
//           return sortMultiplier * a.patientName.localeCompare(b.patientName);
//         case "doctor":
//           return sortMultiplier * a.doctor.localeCompare(b.doctor);
//         case "gender":
//           return sortMultiplier * a.gender.localeCompare(b.gender);
//         case "date": {
//           const dateA = new Date(a.date).getTime();
//           const dateB = new Date(b.date).getTime();
//           return sortMultiplier * (dateA - dateB);
//         }
//         case "time": {
//           const [hoursA, minutesA] = a.time.split(":").map(Number);
//           const [hoursB, minutesB] = b.time.split(":").map(Number);
//           return sortMultiplier * ((hoursA * 60 + minutesA) - (hoursB * 60 + minutesB));
//         }
//         case "injury":
//           return sortMultiplier * a.issue.localeCompare(b.issue);
//         case "status":
//           return sortMultiplier * a.status.localeCompare(b.status);
//         case "visitType":
//           return sortMultiplier * a.visitType.localeCompare(b.visitType);
//         default:
//           return 0;
//       }
//     });
//   }, [appointments, sortColumn, sortOrder]);

//   const paginatedAppointments = useMemo(() => {
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     return sortedAppointments.slice(indexOfFirstItem, indexOfLastItem);
//   }, [sortedAppointments, currentPage, itemsPerPage]);




//   // Form state handlers
//   const [formData, setFormData] = useState<Partial<Appointment>>({
//     patientName: "",
//     email: "",
//     gender: "male",
//     date: new Date().toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//     }),
//     time: "",
//     phone: "",
//     doctor: "",
//     issue: "",
//     status: "Scheduled",
//     visitType: "New Patient",
//   });

//   // Initialize form data when editing
//   useEffect(() => {
//     if (isFormOpen && isEditMode && currentAppointment) {
//       setFormData(currentAppointment);
//     } else if (isFormOpen && !isEditMode) {
//       // Reset form when adding new appointment
//       setFormData({
//         patientName: "",
//         email: "",
//         gender: "male",
//         date: new Date().toLocaleDateString("en-US", {
//           year: "numeric",
//           month: "2-digit",
//           day: "2-digit",
//         }),
//         time: "",
//         phone: "",
//         doctor: "",
//         issue: "",
//         status: "Scheduled",
//         visitType: "New Patient",
//       });
//     }
//   }, [isFormOpen, isEditMode, currentAppointment]);

//   return (
//     <div className="flex h-screen overflow-hidden">
//       {/* Add SVG gradients for charts */}
//       <ChartGradients />

//       {/* Appointment Form Modal */}
//       {isFormOpen && (
//         <AppointmentFormModal
//           isOpen={isFormOpen}
//           onClose={handleFormClose}
//           onSubmit={handleFormSubmit}
//           formData={formData}
//           setFormData={setFormData}
//           isEditMode={isEditMode}
//         />
//       )}

//       {/* Delete Confirmation Dialog */}
//       {isDeleteDialogOpen && (
//         <DeleteConfirmationDialog
//           isOpen={isDeleteDialogOpen}
//           onCancel={handleCancelDelete}
//           onConfirm={handleConfirmDelete}
//         />
//       )}

//       {/* Sidebar */}
//       <Sidebar isOpen={sidebarOpen} />

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-y-auto bg-[#040223] gradient-bg-background">
//         {/* Header */}
//         <Header
//           title="Appointments"
//           icon={<AppointmentsIcon className="h-8 w-8" />}
//           sidebarOpen={sidebarOpen}
//           setSidebarOpen={setSidebarOpen}
//           language={language}
//           setLanguage={setLanguage}
//         />

//         {/* Appointments Content */}
//         <div className="flex-1 px-8 py-8 bg-[#040223]">
//           {/* Breadcrumbs and Title */}
//           <div className="mb-6">
//             <h1 className="text-2xl font-bold text-white">View Appointments</h1>
//           </div>

//           {/* Appointments Table Card */}

//           <AppointmentsTableCard
//             appointments={paginatedAppointments}
//             setAppointments={setAppointments}
//             selectedAppointments={selectedAppointments}
//             setSelectedAppointments={setSelectedAppointments}
//             columns={columns}
//             setColumns={setColumns}
//             showColumnSelector={showColumnSelector}
//             setShowColumnSelector={setShowColumnSelector}
//             columnSelectorRef={columnSelectorRef}
//             sortColumn={sortColumn}
//             setSortColumn={setSortColumn}
//             sortOrder={sortOrder}
//             setSortOrder={setSortOrder}
//             currentPage={currentPage}
//             setCurrentPage={setCurrentPage}
//             itemsPerPage={itemsPerPage}
//             setItemsPerPage={setItemsPerPage}
//             onAddClick={() => {
//               setIsEditMode(false);
//               setCurrentAppointment(null);
//               setIsFormOpen(true);
//             }}
//             onEditClick={(appointment) => {
//               setIsEditMode(true);
//               setCurrentAppointment(appointment);
//               setIsFormOpen(true);
//             }}
//             onDeleteClick={(id) => {
//               setAppointmentToDelete(id);
//               setIsDeleteDialogOpen(true);
//             }}
//             initialAppointments={initialAppointments}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }



// import { useState, RefObject } from "react";
// import SortableHeader from "@/components/ui/SortableHeader";
// import * as XLSX from 'xlsx';
// import { useToast } from "@/hooks/use-toast";
// import { Appointment, ColumnToggle } from "@/components/types/appointment";



// interface AppointmentsTableCardProps {
//   appointments: Appointment[];
//   setAppointments: (appointments: Appointment[]) => void;
//   selectedAppointments: number[];
//   setSelectedAppointments: (ids: number[]) => void;
//   columns: ColumnToggle[];
//   setColumns: (columns: ColumnToggle[]) => void;
//   showColumnSelector: boolean;
//   setShowColumnSelector: (value: boolean) => void;
//   columnSelectorRef: RefObject<HTMLDivElement>;
//   sortColumn: string | null;
//   setSortColumn: (column: string | null) => void;
//   sortOrder: "asc" | "desc" | null;
//   setSortOrder: (order: "asc" | "desc" | null) => void;
//   currentPage: number;
//   setCurrentPage: (page: number) => void;
//   itemsPerPage: number;
//   setItemsPerPage: (items: number) => void;
//   onAddClick: () => void;
//   onEditClick: (appointment: Appointment) => void;
//   onDeleteClick: (id: number) => void;
//   initialAppointments: Appointment[];
// }

// export default function AppointmentsTableCard({
//   appointments,
//   setAppointments,
//   selectedAppointments,
//   setSelectedAppointments,
//   columns,
//   setColumns,
//   showColumnSelector,
//   setShowColumnSelector,
//   columnSelectorRef,
//   sortColumn,
//   setSortColumn,
//   sortOrder,
//   setSortOrder,
//   currentPage,
//   setCurrentPage,
//   itemsPerPage,
//   setItemsPerPage,
//   onAddClick,
//   onEditClick,
//   onDeleteClick,
//   initialAppointments,
// }: AppointmentsTableCardProps) {
//   const { toast } = useToast();
//   const selectAll = selectedAppointments.length === appointments.length;

//   const handleSortClick = (column: string) => {
//     if (sortColumn === column) {
//       const nextOrder = 
//         sortOrder === "asc" ? "desc" :
//         sortOrder === "desc" ? null : 
//         "asc";

//       if (nextOrder === null) {
//         setSortColumn(null);
//         setSortOrder(null);
//       } else {
//         setSortOrder(nextOrder);
//       }
//     } else {
//       setSortColumn(column);
//       setSortOrder("asc");
//     }
//   };



//   const toggleColumnVisibility = (columnId: string) => {
//     setColumns(
//       columns.map((column) =>
//         column.id === columnId
//           ? { ...column, visible: !column.visible }
//           : column,
//       ),
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedAppointments([]);
//     } else {
//       setSelectedAppointments(
//         appointments.map((appointment) => appointment.id),
//       );
//     }
//     setSelectAll(!selectAll);
//   };

//   const handleSelectAppointment = (id: number) => {
//     if (selectedAppointments.includes(id)) {
//       setSelectedAppointments(
//         selectedAppointments.filter((appointmentId) => appointmentId !== id),
//       );
//     } else {
//       setSelectedAppointments([...selectedAppointments, id]);
//     }
//   };

//   const handleBulkDelete = () => {
//     if (selectedAppointments.length === 0) return;

//     const updatedAppointments = appointments.filter(
//       appointment => !selectedAppointments.includes(appointment.id)
//     );

//     setAppointments(updatedAppointments);

//     toast({
//       title: "Appointments Deleted",
//       description: `${selectedAppointments.length} appointment${selectedAppointments.length > 1 ? 's' : ''} successfully removed.`,
//       variant: "destructive",
//       className: "bg-[#450A0A] border border-red-700/50 text-white",
//     });

//     setSelectedAppointments([]);
//     setSelectAll(false);
//   };

//   const handleRefreshTable = () => {
//     setAppointments(initialAppointments);
//     setSelectedAppointments([]);
//     setSelectAll(false);
//     setCurrentPage(1);
//     setSortColumn(null);
//     setSortOrder(null);

//     toast({
//       title: "Table Refreshed",
//       description: "Appointments data has been refreshed.",
//       className: "bg-[#05002E] border border-[#5D0A72]/20 text-white",
//     });
//   };

//   const handleXlsxDownload = () => {
//     try {
//       const exportData = sortedAppointments.map(appointment => ({
//         'Patient Name': appointment.patientName,
//         'Doctor': appointment.doctor,
//         'Gender': appointment.gender,
//         'Date': appointment.date,
//         'Time': appointment.time,
//         'Phone': appointment.phone,
//         'Issue': appointment.issue,
//         'Email': appointment.email,
//         'Status': appointment.status,
//         'Visit Type': appointment.visitType
//       }));

//       const worksheet = XLSX.utils.json_to_sheet(exportData);
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");
//       XLSX.writeFile(workbook, "Cliniva_Appointments.xlsx");

//       toast({
//         title: "Export Successful",
//         description: "Appointments data has been exported to Excel.",
//         className: "bg-[#05002E] border border-[#5D0A72]/20 text-white",
//       });
//     } catch (error) {
//       toast({
//         title: "Export Failed",
//         description: "There was an error exporting the data.",
//         variant: "destructive",
//       });
//       console.error("Export error:", error);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Completed":
//         return "bg-green-100 text-green-800";
//       case "Scheduled":
//         return "bg-blue-100 text-blue-800";
//       case "Cancelled":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getAvatarBg = (gender: string) => {
//     return gender === "female" ? "bg-pink-200" : "bg-blue-200";
//   };

//   const handlePageChange = (newPage: number) => {
//     setCurrentPage(newPage);
//   };

//   const handleItemsPerPageChange = (
//     e: React.ChangeEvent<HTMLSelectElement>,
//   ) => {
//     setItemsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };


//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;

//   const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);

//   return (
//     <div
//       style={{
//         padding: "2px",
//         borderRadius: "1rem",
//         background:
//           "conic-gradient(#072f93 0deg, #03115e 45deg, #031b78 90deg, #0f42c1 135deg, #021a70 180deg, #031a63 225deg, #0a70d2 270deg, #0e82ea 315deg, #072f93 360deg)",
//         display: "grid",
//         boxShadow: `
//           0 4px 8px rgba(7, 47, 147, 0.3),
//           0 0 12px rgba(14, 130, 234, 0.4),
//         `,
//       }}
//     >
//       <div
//         className="bg-[#05002E] rounded-xl overflow-hidden shadow-lg"
//         style={{
//           boxShadow: `inset 0 2px 4px rgba(3, 17, 94, 0.6),
//                       inset 0 -2px 6px rgba(2, 26, 112, 0.8)`,
//         }}
//       >
//         <div className="p-5 flex items-center justify-between border-b border-[#5D0A72]/10">
//           <div className="flex items-center gap-2">
//             <div className="relative w-64">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4 text-[#94A3B8]/70"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <circle cx="11" cy="11" r="8" />
//                   <line x1="21" y1="21" x2="16.65" y2="16.65" />
//                 </svg>
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search"
//                 className="bg-[#02001E] text-sm py-2 pl-10 pr-4 rounded-lg text-[#94A3B8] placeholder-[#94A3B8]/50 focus:outline-none focus:ring-1 focus:ring-[#5D0A72]/50 border border-[#5D0A72]/10 w-full"
//               />
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             {selectedAppointments.length > 0 && (
//               <div className="relative parent-container">
//                 <button
//                   onClick={handleBulkDelete}
//                   className="relative bg-[#450A0A] text-white p-2 rounded-lg hover:bg-[#5A0000] transition-colors border border-red-700/40 group"
//                 >
//                   <span className="absolute invisible group-hover:visible bg-[#450A0A] text-white text-xs px-2 py-1 rounded-lg -bottom-full left-1/2 transform -translate-x-1/2 z-50">
//                     Delete {selectedAppointments.length} Selected
//                   </span>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <path d="M3 6h18" />
//                     <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
//                     <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
//                     <line x1="10" y1="11" x2="10" y2="17" />
//                     <line x1="14" y1="11" x2="14" y2="17" />
//                   </svg>
//                 </button>
//               </div>
//             )}

//             <div className="relative parent-container">
//               <button
//                 onClick={handleRefreshTable}
//                 className="relative bg-[#05002E] text-[#94A3B8] p-2 rounded-lg hover:bg-[#0A004A]/20 transition-colors border border-[#5D0A72]/10 group"
//               >
//                 <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-full left-1/2 transform -translate-x-1/2 z-50">
//                   Refresh Table
//                 </span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
//                   <path d="M21 3v5h-5" />
//                   <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
//                   <path d="M8 16H3v5" />
//                 </svg>
//               </button>
//             </div>

//             <div className="relative parent-container">
//               <button
//                 onClick={handleXlsxDownload}
//                 className="relative bg-[#05002E] text-[#94A3B8] p-2 rounded-lg hover:bg-[#0A004A]/20 transition-colors border border-[#5D0A72]/10 group"
//               >
//                 <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-full left-1/2 transform -translate-x-1/2 z-50">
//                   Export to Excel
//                 </span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
//                   <polyline points="14 2 14 8 20 8" />
//                   <path d="M8 13h2" />
//                   <path d="M8 17h2" />
//                   <path d="M14 13h2" />
//                   <path d="M14 17h2" />
//                 </svg>
//               </button>
//             </div>

//             <div className="relative parent-container">
//               <button
//                 onClick={() => setShowColumnSelector(!showColumnSelector)}
//                 className="relative bg-[#05002E] text-[#94A3B8] p-2 rounded-lg hover:bg-[#0A004A]/20 transition-colors border border-[#5D0A72]/10 group"
//               >
//                 <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-full left-1/2 transform -translate-x-1/2 z-50">
//                   Show/Hide Columns
//                 </span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   viewBox="0 0 24 24"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     clipRule="evenodd"
//                     d="M3 7C3 6.44772 3.44772 6 4 6H20C20.5523 6 21 6.44772 21 7C21 7.55228 20.5523 8 20 8H4C3.44772 8 3 7.5523 3 7ZM6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12ZM9 17C9 16.4477 9.44772 16 10 16H14C14.5523 16 15 16.4477 15 17C15 17.5523 14.5523 18 14 18H10C9.44772 18 9 17.5523 9 17Z"
//                     fill="currentColor"
//                   />
//                 </svg>
//               </button>

//               {showColumnSelector && (
//                 <div
//                   ref={columnSelectorRef}
//                   className="absolute top-12 right-0 z-30 w-64 bg-[#f2f2f4] rounded-lg shadow-lg border border-[#5D0A72]/10 overflow-hidden"
//                   style={{ maxHeight: "400px", overflowY: "auto" }}
//                 >
//                   <div className="sticky top-0 bg-[#e9eaec] p-3 border-b border-gray-300">
//                     <h3 className="text-gray-700 font-medium text-base">
//                       Show/Hide Column
//                     </h3>
//                   </div>
//                   <div className="overflow-y-auto">
//                     {columns.map((column) => (
//                       <div
//                         key={column.id}
//                         className="flex items-center px-4 py-3 hover:bg-gray-100 border-b border-gray-200"
//                       >
//                         <input
//                           type="checkbox"
//                           id={`column-${column.id}`}
//                           checked={column.visible}
//                           onChange={() => toggleColumnVisibility(column.id)}
//                           className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                         />
//                         <label
//                           htmlFor={`column-${column.id}`}
//                           className="ml-3 text-sm text-gray-700 cursor-pointer"
//                         >
//                           {column.label}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="relative parent-container">
//               <button
//                 onClick={onAddClick}
//                 className="relative bg-[#05002E] text-[#94A3B8] p-2 rounded-lg hover:bg-[#0A004A]/20 transition-colors border border-[#5D0A72]/10 group"
//               >
//                 <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-full left-1/2 transform -translate-x-1/2 z-50">
//                   Add New Appointment
//                 </span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                 >
//                   <circle
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="1.5"
//                   />
//                   <path
//                     d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
//                     stroke="currentColor"
//                     strokeWidth="1.5"
//                     strokeLinecap="round"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="overflow-x-auto p-4 bg-[#05002E]">
//           <table className="w-full bg-[#05002E]">
//             <thead>
//               <tr className="text-left text-[#94A3B8] bg-[#03001c]">
//                 <th className="py-4 px-6 font-medium rounded-l-lg">
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={selectAll}
//                       onChange={handleSelectAll}
//                       className="rounded border-[#5D0A72]/30 text-[#5D0A72] focus:ring-[#5D0A72]/30 h-4 w-4"
//                     />
//                   </div>
//                 </th>
//                 {columns.find((c) => c.id === "name")?.visible && (
//                   <SortableHeader
//                     label="Name"
//                     columnKey="patientName"
//                     sortColumn={sortColumn}
//                     sortOrder={sortOrder}
//                     onSort={handleSortClick}
//                   />
//                 )}
//                 {columns.find((c) => c.id === "doctor")?.visible && (
//                   <SortableHeader
//                     label="Doctor"
//                     columnKey="doctor"
//                     sortColumn={sortColumn}
//                     sortOrder={sortOrder}
//                     onSort={handleSortClick}
//                   />
//                 )}
//                 {columns.find((c) => c.id === "gender")?.visible && (
//                   <SortableHeader
//                     label="Gender"
//                     columnKey="gender"
//                     sortColumn={sortColumn}
//                     sortOrder={sortOrder}
//                     onSort={handleSortClick}
//                   />
//                 )}
//                 {columns.find((c) => c.id === "date")?.visible && (
//                   <SortableHeader
//                     label="Date"
//                     columnKey="date"
//                     sortColumn={sortColumn}
//                     sortOrder={sortOrder}
//                     onSort={handleSortClick}
//                   />
//                 )}
//                 {columns.find((c) => c.id === "time")?.visible && (
//                   <SortableHeader
//                     label="Time"
//                     columnKey="time"
//                     sortColumn={sortColumn}
//                     sortOrder={sortOrder}
//                     onSort={handleSortClick}
//                   />
//                 )}
//                 {columns.find((c) => c.id === "mobile")?.visible && (
//                   <th className="py-4 px-6 font-medium">Mobile</th>
//                 )}
//                 {columns.find((c) => c.id === "injury")?.visible && (
//                   <SortableHeader
//                     label="Injury"
//                     columnKey="injury"
//                     sortColumn={sortColumn}
//                     sortOrder={sortOrder}
//                     onSort={handleSortClick}
//                   />
//                 )}
//                 {columns.find((c) => c.id === "email")?.visible && (
//                   <th className="py-4 px-6 font-medium">Email</th>
//                 )}
//                 {columns.find((c) => c.id === "status")?.visible && (
//                   <SortableHeader
//                     label="Status"
//                     columnKey="status"
//                     sortColumn={sortColumn}
//                     sortOrder={sortOrder}
//                     onSort={handleSortClick}
//                   />
//                 )}
//                 {columns.find((c) => c.id === "visitType")?.visible && (
//                   <SortableHeader
//                     label="Visit Type"
//                     columnKey="visitType"
//                     sortColumn={sortColumn}
//                     sortOrder={sortOrder}
//                     onSort={handleSortClick}
//                   />
//                 )}
//                 <th className="py-4 px-6 font-medium rounded-r-lg">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-[#5D0A72]/10">
//               {currentAppointments.map((appointment) => (
//                 <tr
//                   key={appointment.id}
//                   className="text-[#94A3B8] hover:bg-[#02001e]/30 transition-colors even:bg-[#000041] cursor-pointer"
//                   onClick={(e) => {
//                     if ((e.target as HTMLElement).closest('input[type="checkbox"]') ||
//                         (e.target as HTMLElement).closest('button')) {
//                       return;
//                     }
//                     onEditClick(appointment);
//                   }}
//                 >
//                   <td className="py-4 px-6">
//                     <input
//                       type="checkbox"
//                       checked={selectedAppointments.includes(appointment.id)}
//                       onChange={() => handleSelectAppointment(appointment.id)}
//                       className="rounded border-[#5D0A72]/30 text-[#5D0A72] focus:ring-[#5D0A72]/30 h-4 w-4"
//                     />
//                   </td>
//                   {columns.find((c) => c.id === "name")?.visible && (
//                     <td className="py-4 px-6">
//                       <div className="flex items-center gap-3">
//                         <div
//                           className={`w-10 h-10 rounded-full flex items-center justify-center ${getAvatarBg(appointment.gender)}`}
//                         >
//                           <span className="text-sm font-medium">
//                             {appointment.patientName
//                               .split(" ")
//                               .map((n) => n[0])
//                               .join("")}
//                           </span>
//                         </div>
//                         <div className="relative group">
//                           <span className="truncate block max-w-[150px]">{appointment.patientName}</span>
//                           <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-8 left-0 z-50 whitespace-nowrap">
//                             {appointment.patientName}
//                           </span>
//                         </div>
//                       </div>
//                     </td>
//                   )}
//                   {columns.find((c) => c.id === "doctor")?.visible && (
//                     <td className="py-4 px-6">
//                       <div className="relative group">
//                         <span className="truncate block max-w-[150px]">{appointment.doctor}</span>
//                         <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-8 left-0 z-50 whitespace-nowrap">
//                           {appointment.doctor}
//                         </span>
//                       </div>
//                     </td>
//                   )}
//                   {columns.find((c) => c.id === "gender")?.visible && (
//                     <td className="py-4 px-6">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium ${
//                           appointment.gender === "female"
//                             ? "bg-pink-100 text-pink-800"
//                             : "bg-blue-100 text-blue-800"
//                         }`}
//                       >
//                         {appointment.gender}
//                       </span>
//                     </td>
//                   )}
//                   {columns.find((c) => c.id === "date")?.visible && (
//                     <td className="py-4 px-6">
//                       <div className="relative group">
//                         <span className="truncate block max-w-[120px]">{appointment.date}</span>
//                         <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-8 left-0 z-50 whitespace-nowrap">
//                           {appointment.date}
//                         </span>
//                       </div>
//                     </td>
//                   )}
//                   {columns.find((c) => c.id === "time")?.visible && (
//                     <td className="py-4 px-6">
//                       <div className="flex items-center">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-4 w-4 mr-2 text-[#94A3B8]/70 flex-shrink-0"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         >
//                           <circle cx="12" cy="12" r="10" />
//                           <polyline points="12 6 12 12 16 14" />
//                         </svg>
//                         <div className="relative group">
//                           <span className="truncate block max-w-[100px]">{appointment.time}</span>
//                           <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-8 left-0 z-50 whitespace-nowrap">
//                             {appointment.time}
//                           </span>
//                         </div>
//                       </div>
//                     </td>
//                   )}
//                   {columns.find((c) => c.id === "mobile")?.visible && (
//                     <td className="py-4 px-6">
//                       <div className="flex items-center">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-4 w-4 mr-2 text-[#94A3B8]/70 flex-shrink-0"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         >
//                           <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
//                         </svg>
//                         <div className="relative group">
//                           <span className="truncate block max-w-[120px]">{appointment.phone}</span>
//                           <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-8 left-0 z-50 whitespace-nowrap">
//                             {appointment.phone}
//                           </span>
//                         </div>
//                       </div>
//                     </td>
//                   )}
//                   {columns.find((c) => c.id === "injury")?.visible && (
//                     <td className="py-4 px-6">
//                       <div className="relative group">
//                         <span className="truncate block max-w-[150px]">{appointment.issue}</span>
//                         <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-8 left-0 z-50 whitespace-nowrap">
//                           {appointment.issue}
//                         </span>
//                       </div>
//                     </td>
//                   )}
//                   {columns.find((c) => c.id === "email")?.visible && (
//                     <td className="py-4 px-6">
//                       <div className="flex items-center">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-4 w-4 mr-2 text-[#94A3B8]/70 flex-shrink-0"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         >
//                           <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
//                           <polyline points="22,6 12,13 2,6" />
//                         </svg>
//                         <div className="relative group">
//                           <span className="truncate block max-w-[150px]">{appointment.email}</span>
//                           <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-8 left-0 z-50 whitespace-nowrap">
//                             {appointment.email}
//                           </span>
//                         </div>
//                       </div>
//                     </td>
//                   )}
//                   {columns.find((c) => c.id === "status")?.visible && (
//                     <td className="py-4 px-6">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}
//                       >
//                         {appointment.status}
//                       </span>
//                     </td>
//                   )}
//                   {columns.find((c) => c.id === "visitType")?.visible && (
//                     <td className="py-4 px-6">
//                       <div className="relative group">
//                         <span className="truncate block max-w-[150px]">{appointment.visitType}</span>
//                         <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-8 left-0 z-50 whitespace-nowrap">
//                           {appointment.visitType}
//                         </span>
//                       </div>
//                     </td>
//                   )}
//                   <td className="py-4 px-6">
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           onEditClick(appointment);
//                         }}
//                         className="text-blue-500 hover:text-blue-700"
//                       >
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-5 w-5"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         >
//                           <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
//                           <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
//                         </svg>
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           onDeleteClick(appointment.id);
//                         }}
//                         className="text-red-500 hover:text-red-700"
//                       >
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-5 w-5"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         >
//                           <polyline points="3 6 5 6 21 6" />
//                           <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
//                         </svg>
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="p-4 flex items-center justify-between border-t border-[#5D0A72]/10">
//           <div className="text-sm text-[#94A3B8]">
//             Items per page:
//             <select
//               className="ml-2 bg-[#02001E] border border-[#5D0A72]/20 rounded px-2 py-1 text-[#94A3B8]"
//               value={itemsPerPage}
//               onChange={handleItemsPerPageChange}
//             >
//               <option value="5">5</option>
//               <option value="10">10</option>
//               <option value="20">20</option>
//               <option value="50">50</option>
//             </select>
//           </div>
//           <div className="text-sm text-[#94A3B8]">
//             {indexOfFirstItem + 1}-
//             {Math.min(indexOfLastItem, sortedAppointments.length)} of{" "}
//             {sortedAppointments.length}
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               className={`p-1 rounded-md border border-[#5D0A72]/20 ${
//                 currentPage === 1
//                   ? "text-[#94A3B8]/30 cursor-not-allowed"
//                   : "text-[#94A3B8] hover:bg-[#5D0A72]/10 cursor-pointer"
//               }`}
//               onClick={() =>
//                 currentPage > 1 && handlePageChange(currentPage - 1)
//               }
//               disabled={currentPage === 1}

//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <polyline points="15 18 9 12 15 6" />
//               </svg>
//             </button>

//             <div className="flex items-center">
//               {Array.from({ length: Math.min(totalPages, 3) }).map(
//                 (_, index) => {
//                   let pageNum;
//                   if (totalPages <= 3) {
//                     pageNum = index + 1;
//                   } else if (currentPage <= 2) {
//                     pageNum = index + 1;
//                   } else if (currentPage >= totalPages - 1) {
//                     pageNum = totalPages - 2 + index;
//                   } else {
//                     pageNum = currentPage - 1 + index;
//                   }

//                   return (
//                     <button
//                       key={pageNum}
//                       onClick={() => handlePageChange(pageNum)}
//                       className={`w-8 h-8 mx-1 rounded-md flex items-center justify-center ${
//                         currentPage === pageNum
//                           ? "bg-[#5D0A72]/30 text-white"
//                           : "text-[#94A3B8] hover:bg-[#5D0A72]/10"
//                       }`}
//                     >
//                       {pageNum}
//                     </button>
//                   );
//                 },
//               )}
//             </div>

//             <button
//               className={`p-1 rounded-md border border-[#5D0A72]/20 ${
//                 currentPage === totalPages
//                   ? "text-[#94A3B8]/30 cursor-not-allowed"
//                   : "text-[#94A3B8] hover:bg-[#5D0A72]/10 cursor-pointer"
//               }`}
//               onClick={() =>
//                 currentPage < totalPages && handlePageChange(currentPage + 1)
//               }
//               disabled={currentPage === totalPages}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <polyline points="9 18 15 12 9 6" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>

//   );
// }






// import { useState, RefObject, useMemo, useEffect } from "react";
// import SortableHeader from "@/components/ui/SortableHeader";
// import * as XLSX from 'xlsx';
// import { useToast } from "@/hooks/use-toast";
// import { Appointment, ColumnToggle } from "@/components/types/appointment";

// interface AppointmentsTableCardProps {
//   appointments: Appointment[];
//   setAppointments: (appointments: Appointment[]) => void;
//   selectedAppointments: number[];
//   setSelectedAppointments: (ids: number[]) => void;
//   columns: ColumnToggle[];
//   setColumns: (columns: ColumnToggle[]) => void;
//   showColumnSelector: boolean;
//   setShowColumnSelector: (value: boolean) => void;
//   columnSelectorRef: RefObject<HTMLDivElement>;
//   sortColumn: string | null;
//   setSortColumn: (column: string | null) => void;
//   sortOrder: "asc" | "desc" | null;
//   setSortOrder: (order: "asc" | "desc" | null) => void;
//   currentPage: number;
//   setCurrentPage: (page: number) => void;
//   itemsPerPage: number;
//   setItemsPerPage: (items: number) => void;
//   onAddClick: () => void;
//   onEditClick: (appointment: Appointment) => void;
//   onDeleteClick: (id: number) => void;
//   initialAppointments: Appointment[];
// }

// export default function AppointmentsTableCard({
//   appointments,
//   setAppointments,
//   selectedAppointments,
//   setSelectedAppointments,
//   columns,
//   setColumns,
//   showColumnSelector,
//   setShowColumnSelector,
//   columnSelectorRef,
//   sortColumn,
//   setSortColumn,
//   sortOrder,
//   setSortOrder,
//   currentPage,
//   setCurrentPage,
//   itemsPerPage,
//   setItemsPerPage,
//   onAddClick,
//   onEditClick,
//   onDeleteClick,
//   initialAppointments,
// }: AppointmentsTableCardProps) {
//   const { toast } = useToast();
//   const [selectAll, setSelectAll] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Apply search filter first
//   const filteredAppointments = useMemo(() => {
//     if (!searchTerm.trim()) {
//       return appointments;
//     }

//     const lowerCaseSearch = searchTerm.toLowerCase().trim();

//     return appointments.filter(appointment => {
//       return (
//         appointment.patientName.toLowerCase().includes(lowerCaseSearch) ||
//         appointment.doctor.toLowerCase().includes(lowerCaseSearch) ||
//         appointment.issue.toLowerCase().includes(lowerCaseSearch) ||
//         appointment.status.toLowerCase().includes(lowerCaseSearch) ||
//         appointment.visitType.toLowerCase().includes(lowerCaseSearch) ||
//         appointment.email.toLowerCase().includes(lowerCaseSearch) ||
//         appointment.phone.toLowerCase().includes(lowerCaseSearch)
//       );
//     });
//   }, [appointments, searchTerm]);

//   // Then sort the filtered appointments
//   const sortedAppointments = useMemo(() => {
//     return [...filteredAppointments].sort((a, b) => {
//       if (sortOrder === null || sortColumn === null) {
//         return a.id - b.id; // Default sort by ID
//       }

//       const sortMultiplier = sortOrder === "asc" ? 1 : -1;

//       switch (sortColumn) {
//         case "id":
//           return sortMultiplier * (a.id - b.id);
//         case "patientName":
//           return sortMultiplier * a.patientName.localeCompare(b.patientName);
//         case "doctor":
//           return sortMultiplier * a.doctor.localeCompare(b.doctor);
//         case "gender":
//           return sortMultiplier * a.gender.localeCompare(b.gender);
//         case "date": {
//           // Convert dates for proper comparison (MM/DD/YYYY format)
//           const dateA = new Date(a.date).getTime();
//           const dateB = new Date(b.date).getTime();
//           return sortMultiplier * (dateA - dateB);
//         }
//         case "time": {
//           // Convert times for comparison
//           const timeA = a.time.split(":").map(Number);
//           const timeB = b.time.split(":").map(Number);
//           const minutesA = timeA[0] * 60 + timeA[1];
//           const minutesB = timeB[0] * 60 + timeB[1];
//           return sortMultiplier * (minutesA - minutesB);
//         }
//         case "injury":
//           return sortMultiplier * a.issue.localeCompare(b.issue);
//         case "status":
//           return sortMultiplier * a.status.localeCompare(b.status);
//         case "visitType":
//           return sortMultiplier * a.visitType.localeCompare(b.visitType);
//         default:
//           return 0;
//       }
//     });
//   }, [filteredAppointments, sortColumn, sortOrder]);

//   // Update selectAll state whenever selectedAppointments or sortedAppointments change
//   useEffect(() => {
//     if (sortedAppointments.length === 0) {
//       setSelectAll(false);
//     } else {
//       setSelectAll(selectedAppointments.length === sortedAppointments.length);
//     }
//   }, [selectedAppointments, sortedAppointments]);

//   // Pagination calculations
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;

//   // Get current page of appointments
//   const currentAppointments = useMemo(() => {
//     return sortedAppointments.slice(indexOfFirstItem, indexOfLastItem);
//   }, [sortedAppointments, indexOfFirstItem, indexOfLastItem]);

//   // Total pages for pagination
//   const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);

//   const handleSortClick = (column: string) => {
//     if (sortColumn === column) {
//       const nextOrder = 
//         sortOrder === "asc" ? "desc" :
//         sortOrder === "desc" ? null : 
//         "asc";

//       if (nextOrder === null) {
//         setSortColumn(null);
//         setSortOrder(null);
//       } else {
//         setSortOrder(nextOrder);
//       }
//     } else {
//       setSortColumn(column);
//       setSortOrder("asc");
//     }
//   };

//   const toggleColumnVisibility = (columnId: string) => {
//     setColumns(
//       columns.map((column) =>
//         column.id === columnId
//           ? { ...column, visible: !column.visible }
//           : column,
//       ),
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedAppointments([]);
//     } else {
//       setSelectedAppointments(
//         sortedAppointments.map((appointment) => appointment.id),
//       );
//     }
//   };

//   const handleSelectAppointment = (id: number) => {
//     if (selectedAppointments.includes(id)) {
//       setSelectedAppointments(
//         selectedAppointments.filter((appointmentId) => appointmentId !== id),
//       );
//     } else {
//       setSelectedAppointments([...selectedAppointments, id]);
//     }
//   };

//   const handleBulkDelete = () => {
//     if (selectedAppointments.length === 0) return;

//     const updatedAppointments = appointments.filter(
//       appointment => !selectedAppointments.includes(appointment.id)
//     );

//     setAppointments(updatedAppointments);

//     toast({
//       title: "Appointments Deleted",
//       description: `${selectedAppointments.length} appointment${selectedAppointments.length > 1 ? 's' : ''} successfully removed.`,
//       variant: "destructive",
//       className: "bg-[#450A0A] border border-red-700/50 text-white",
//     });

//     setSelectedAppointments([]);
//   };

//   const handleRefreshTable = () => {
//     setAppointments(initialAppointments);
//     setSelectedAppointments([]);
//     setCurrentPage(1);
//     setSortColumn(null);
//     setSortOrder(null);
//     setSearchTerm("");

//     toast({
//       title: "Table Refreshed",
//       description: "Appointments data has been refreshed.",
//       className: "bg-[#05002E] border border-[#5D0A72]/20 text-white",
//     });
//   };

//   const handleXlsxDownload = () => {
//     try {
//       const exportData = sortedAppointments.map((appointment: Appointment) => ({
//         'Patient Name': appointment.patientName,
//         'Doctor': appointment.doctor,
//         'Gender': appointment.gender,
//         'Date': appointment.date,
//         'Time': appointment.time,
//         'Phone': appointment.phone,
//         'Issue': appointment.issue,
//         'Email': appointment.email,
//         'Status': appointment.status,
//         'Visit Type': appointment.visitType
//       }));

//       const worksheet = XLSX.utils.json_to_sheet(exportData);
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");
//       XLSX.writeFile(workbook, "Cliniva_Appointments.xlsx");

//       toast({
//         title: "Export Successful",
//         description: "Appointments data has been exported to Excel.",
//         className: "bg-[#05002E] border border-[#5D0A72]/20 text-white",
//       });
//     } catch (error) {
//       toast({
//         title: "Export Failed",
//         description: "There was an error exporting the data.",
//         variant: "destructive",
//       });
//       console.error("Export error:", error);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Completed":
//         return "bg-green-100 text-green-800";
//       case "Scheduled":
//         return "bg-blue-100 text-blue-800";
//       case "Cancelled":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getAvatarBg = (gender: string) => {
//     return gender === "female" ? "bg-pink-200" : "bg-blue-200";
//   };

//   const handlePageChange = (newPage: number) => {
//     setCurrentPage(newPage);
//   };

//   const handleItemsPerPageChange = (
//     e: React.ChangeEvent<HTMLSelectElement>,
//   ) => {
//     setItemsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   // Generate pagination items
//   const paginationItems = () => {
//     const items = [];
//     const maxPagesToShow = 5;
//     const startPage = Math.max(
//       1,
//       currentPage - Math.floor(maxPagesToShow / 2),
//     );
//     const endPage = Math.min(
//       totalPages,
//       startPage + maxPagesToShow - 1,
//     );

//     for (let i = startPage; i <= endPage; i++) {
//       items.push(
//         <button
//           key={i}
//           onClick={() => handlePageChange(i)}
//           className={`px-3 py-1 rounded-md ${
//             currentPage === i
//               ? "bg-[#3466ad] text-white"
//               : "bg-[#02001E] text-[#94A3B8] hover:bg-[#0A004A]/50"
//           }`}
//         >
//           {i}
//         </button>,
//       );
//     }
//     return items;
//   };

//   return (
//     <div
//       style={{
//         padding: "2px",
//         borderRadius: "1rem",
//         background:
//           "conic-gradient(#072f93 0deg, #03115e 45deg, #031b78 90deg, #0f42c1 135deg, #021a70 180deg, #031a63 225deg, #0a70d2 270deg, #0e82ea 315deg, #072f93 360deg)",
//         display: "grid",
//         boxShadow: `
//           0 4px 8px rgba(7, 47, 147, 0.3),
//           0 0 12px rgba(14, 130, 234, 0.4),
//         `,
//       }}
//     >
//       <div
//         className="bg-[#05002E] rounded-xl overflow-hidden shadow-lg"
//         style={{
//           boxShadow: `inset 0 2px 4px rgba(3, 17, 94, 0.6),
//                       inset 0 -2px 6px rgba(2, 26, 112, 0.8)`,
//         }}
//       >
//         <div className="p-5 flex items-center justify-between border-b border-[#5D0A72]/10">
//           <div className="flex items-center gap-2">
//             <div className="relative w-64">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4 text-[#94A3B8]/70"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <circle cx="11" cy="11" r="8" />
//                   <line x1="21" y1="21" x2="16.65" y2="16.65" />
//                 </svg>
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search"
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   setCurrentPage(1); // Reset to first page when searching
//                 }}
//                 className="bg-[#02001E] text-sm py-2 pl-10 pr-4 rounded-lg text-[#94A3B8] placeholder-[#94A3B8]/50 focus:outline-none focus:ring-1 focus:ring-[#5D0A72]/50 border border-[#5D0A72]/10 w-full"
//               />
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             {selectedAppointments.length > 0 && (
//               <div className="relative parent-container">
//                 <button
//                   onClick={handleBulkDelete}
//                   className="relative bg-[#450A0A] text-white p-2 rounded-lg hover:bg-[#5A0000] transition-colors border border-red-700/40 group"
//                 >
//                   <span className="absolute invisible group-hover:visible bg-[#450A0A] text-white text-xs px-2 py-1 rounded-lg -bottom-full left-1/2 transform -translate-x-1/2 z-50">
//                     Delete {selectedAppointments.length} Selected
//                   </span>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <path d="M3 6h18" />
//                     <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
//                     <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
//                     <line x1="10" y1="11" x2="10" y2="17" />
//                     <line x1="14" y1="11" x2="14" y2="17" />
//                   </svg>
//                 </button>
//               </div>
//             )}

//             <div className="relative parent-container">
//               <button
//                 onClick={handleRefreshTable}
//                 className="relative bg-[#05002E] text-[#94A3B8] p-2 rounded-lg hover:bg-[#0A004A]/20 transition-colors border border-[#5D0A72]/10 group"
//               >
//                 <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-full left-1/2 transform -translate-x-1/2 z-50">
//                   Refresh Table
//                 </span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
//                   <path d="M21 3v5h-5" />
//                   <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
//                   <path d="M8 16H3v5" />
//                 </svg>
//               </button>
//             </div>

//             <div className="relative parent-container">
//               <button
//                 onClick={handleXlsxDownload}
//                 className="relative bg-[#05002E] text-[#94A3B8] p-2 rounded-lg hover:bg-[#0A004A]/20 transition-colors border border-[#5D0A72]/10 group"
//               >
//                 <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-full left-1/2 transform -translate-x-1/2 z-50">
//                   Export to Excel
//                 </span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
//                   <polyline points="14 2 14 8 20 8" />
//                   <path d="M8 13h2" />
//                   <path d="M8 17h2" />
//                   <path d="M14 13h2" />
//                   <path d="M14 17h2" />
//                 </svg>
//               </button>
//             </div>

//             <div className="relative parent-container">
//               <button
//                 onClick={() => setShowColumnSelector(!showColumnSelector)}
//                 className="relative bg-[#05002E] text-[#94A3B8] p-2 rounded-lg hover:bg-[#0A004A]/20 transition-colors border border-[#5D0A72]/10 group"
//               >
//                 <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-full left-1/2 transform -translate-x-1/2 z-50">
//                   Show/Hide Columns
//                 </span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   viewBox="0 0 24 24"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     clipRule="evenodd"
//                     d="M3 7C3 6.44772 3.44772 6 4 6H20C20.5523 6 21 6.44772 21 7C21 7.55228 20.5523 8 20 8H4C3.44772 8 3 7.5523 3 7ZM6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12ZM9 17C9 16.4477 9.44772 16 10 16H14C14.5523 16 15 16.4477 15 17C15 17.5523 14.5523 18 14 18H10C9.44772 18 9 17.5523 9 17Z"
//                     fill="currentColor"
//                   />
//                 </svg>
//               </button>

//               {showColumnSelector && (
//                 <div
//                   ref={columnSelectorRef}
//                   className="absolute top-12 right-0 z-30 w-64 bg-[#f2f2f4] rounded-lg shadow-lg border border-[#5D0A72]/10 overflow-hidden"
//                   style={{ maxHeight: "400px", overflowY: "auto" }}
//                 >
//                   <div className="sticky top-0 bg-[#e9eaec] p-3 border-b border-gray-300">
//                     <h3 className="text-gray-700 font-medium text-base">
//                       Show/Hide Column
//                     </h3>
//                   </div>
//                   <div className="overflow-y-auto">
//                     {columns.map((column) => (
//                       <div
//                         key={column.id}
//                         className="flex items-center px-4 py-3 hover:bg-gray-100 border-b border-gray-200"
//                       >
//                         <input
//                           type="checkbox"
//                           id={`column-${column.id}`}
//                           checked={column.visible}
//                           onChange={() => toggleColumnVisibility(column.id)}
//                           className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                         />
//                         <label
//                           htmlFor={`column-${column.id}`}
//                           className="ml-3 text-sm text-gray-700 cursor-pointer"
//                         >
//                           {column.label}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="relative parent-container">
//               <button
//                 onClick={onAddClick}
//                 className="relative bg-[#05002E] text-[#94A3B8] p-2 rounded-lg hover:bg-[#0A004A]/20 transition-colors border border-[#5D0A72]/10 group"
//               >
//                 <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-full left-1/2 transform -translate-x-1/2 z-50">
//                   Add New Appointment
//                 </span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                 >
//                   <circle
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="1.5"
//                   />
//                   <path
//                     d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
//                     stroke="currentColor"
//                     strokeWidth="1.5"
//                     strokeLinecap="round"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="overflow-x-auto p-4 bg-[#05002E]">
//           <table className="w-full bg-[#05002E]">
//             <thead>
//               <tr className="text-left text-[#94A3B8] bg-[#03001c]">
//                 <th className="py-4 px-6 font-medium rounded-l-lg">
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={selectAll}
//                       onChange={handleSelectAll}
//                       className="rounded border-[#5D0A72]/30 text-[#5D0A72] focus:ring-[#5D0A72]/30 h-4 w-4"
//                     />
//                   </div>
//                 </th>
//                 {columns.find((c) => c.id === "name")?.visible && (
//                   <SortableHeader
//                     label="Name"
//                     columnKey="patientName"
//                     sortColumn={sortColumn}
//                     sortOrder={sortOrder}
//                     onSort={handleSortClick}
//                   />
//                 )}
//                 {columns.find((c) => c.id === "doctor")?.visible && (
//                   <SortableHeader
//                     label="Doctor"
//                     columnKey="doctor"
//                     sortColumn={sortColumn}
//                     sortOrder={sortOrder}
//                     onSort={handleSortClick}
//                   />
//                 )}
//                 {columns.find((c) => c.id === "gender")?.visible && (
//                   <SortableHeader
//                     label="Gender"
//                     columnKey="gender"
//                     sortColumn={sortColumn}
//                     sortOrder={sortOrder}
//                     onSort={handleSortClick}
//                   />
//                 )}
//                 {columns.find((c) => c.id === "date")?.visible && (
//                   <SortableHeader
//                     label="Date"
//                     columnKey="date"
//                     sortColumn={sortColumn}
//                     sortOrder={sortOrder}
//                     onSort={handleSortClick}
//                   />
//                 )}
//                 {columns.find((c) => c.id === "time")?.visible && (
//                   <SortableHeader
//                     label="Time"
//                     columnKey="time"
//                     sortColumn={sortColumn}
//                     sortOrder={sortOrder}
//                     onSort={handleSortClick}
//                   />
//                 )}
//                 {columns.find((c) => c.id === "mobile")?.visible && (
//                   <th className="py-4 px-6 font-medium">Mobile</th>
//                 )}
//                 {columns.find((c) => c.id === "injury")?.visible && (
//                   <SortableHeader
//                     label="Injury"
//                     columnKey="injury"
//                     sortColumn={sortColumn}
//                     sortOrder={sortOrder}
//                     onSort={handleSortClick}
//                   />
//                 )}
//                 {columns.find((c) => c.id === "email")?.visible && (
//                   <th className="py-4 px-6 font-medium">Email</th>
//                 )}
//                 {columns.find((c) => c.id === "status")?.visible && (
//                   <SortableHeader
//                     label="Status"
//                     columnKey="status"
//                     sortColumn={sortColumn}
//                     sortOrder={sortOrder}
//                     onSort={handleSortClick}
//                   />
//                 )}
//                 {columns.find((c) => c.id === "visitType")?.visible && (
//                   <SortableHeader
//                     label="Visit Type"
//                     columnKey="visitType"
//                     sortColumn={sortColumn}
//                     sortOrder={sortOrder}
//                     onSort={handleSortClick}
//                   />
//                 )}
//                 <th className="py-4 px-6 font-medium rounded-r-lg text-center">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-[#5D0A72]/10">
//               {currentAppointments.map((appointment) => (
//                 <tr
//                   key={appointment.id}
//                   className="text-[#94A3B8] hover:bg-[#02001e]/30 transition-colors even:bg-[#000041] cursor-pointer"
//                   onClick={(e) => {
//                     if ((e.target as HTMLElement).closest('input[type="checkbox"]') ||
//                         (e.target as HTMLElement).closest('button')) {
//                       return;
//                     }
//                     onEditClick(appointment);
//                   }}
//                 >
//                   <td className="py-4 px-6">
//                     <input
//                       type="checkbox"
//                       checked={selectedAppointments.includes(appointment.id)}
//                       onChange={() => handleSelectAppointment(appointment.id)}
//                       className="rounded border-[#5D0A72]/30 text-[#5D0A72] focus:ring-[#5D0A72]/30 h-4 w-4"
//                     />
//                   </td>
//                   {columns.find((c) => c.id === "name")?.visible && (
//                     <td className="py-4 px-6">
//                       <div className="flex items-center gap-3">
//                         <div
//                           className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium ${getAvatarBg(
//                             appointment.gender,
//                           )}`}
//                         >
//                           {appointment.patientName.charAt(0)}
//                         </div>
//                         <div className="truncate max-w-[120px]" title={appointment.patientName}>
//                           {appointment.patientName}
//                         </div>
//                       </div>
//                     </td>
//                   )}
//                   {columns.find((c) => c.id === "doctor")?.visible && (
//                     <td className="py-4 px-6">
//                       <div className="truncate max-w-[120px]" title={appointment.doctor}>
//                         {appointment.doctor}
//                       </div>
//                     </td>
//                   )}
//                   {columns.find((c) => c.id === "gender")?.visible && (
//                     <td className="py-4 px-6">
//                       {appointment.gender === "male" ? "Male" : "Female"}
//                     </td>
//                   )}
//                   {columns.find((c) => c.id === "date")?.visible && (
//                     <td className="py-4 px-6">{appointment.date}</td>
//                   )}
//                   {columns.find((c) => c.id === "time")?.visible && (
//                     <td className="py-4 px-6">{appointment.time}</td>
//                   )}
//                   {columns.find((c) => c.id === "mobile")?.visible && (
//                     <td className="py-4 px-6">
//                       <div className="truncate max-w-[120px]" title={appointment.phone}>
//                         {appointment.phone}
//                       </div>
//                     </td>
//                   )}
//                   {columns.find((c) => c.id === "injury")?.visible && (
//                     <td className="py-4 px-6">
//                       <div className="truncate max-w-[150px]" title={appointment.issue}>
//                         {appointment.issue}
//                       </div>
//                     </td>
//                   )}
//                   {columns.find((c) => c.id === "email")?.visible && (
//                     <td className="py-4 px-6">
//                       <div className="truncate max-w-[150px]" title={appointment.email}>
//                         {appointment.email}
//                       </div>
//                     </td>
//                   )}
//                   {columns.find((c) => c.id === "status")?.visible && (
//                     <td className="py-4 px-6">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
//                           appointment.status,
//                         )}`}
//                       >
//                         {appointment.status}
//                       </span>
//                     </td>
//                   )}
//                   {columns.find((c) => c.id === "visitType")?.visible && (
//                     <td className="py-4 px-6">
//                       <div className="truncate max-w-[120px]" title={appointment.visitType}>
//                         {appointment.visitType}
//                       </div>
//                     </td>
//                   )}
//                   <td className="py-4 px-6 text-center">
//                     <div className="flex items-center justify-center gap-3">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           onEditClick(appointment);
//                         }}
//                         className="text-blue-500 hover:text-blue-700 transition-colors"
//                       >
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-5 w-5"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         >
//                           <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
//                           <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
//                         </svg>
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           onDeleteClick(appointment.id);
//                         }}
//                         className="text-red-500 hover:text-red-700 transition-colors"
//                       >
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-5 w-5"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         >
//                           <path d="M3 6h18" />
//                           <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
//                           <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
//                           <line x1="10" y1="11" x2="10" y2="17" />
//                           <line x1="14" y1="11" x2="14" y2="17" />
//                         </svg>
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//               {currentAppointments.length === 0 && (
//                 <tr className="text-center">
//                   <td colSpan={12} className="py-6 text-[#94A3B8]">
//                     {searchTerm.trim()
//                       ? "No appointments matching your search"
//                       : "No appointments available"}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="p-4 bg-[#05002E] border-t border-[#5D0A72]/10 flex flex-col sm:flex-row justify-between items-center gap-4">
//           <div className="flex items-center gap-2 text-[#94A3B8] text-sm">
//             <span>Rows per page:</span>
//             <select
//               value={itemsPerPage}
//               onChange={handleItemsPerPageChange}
//               className="bg-[#03001c] border border-[#5D0A72]/10 rounded-md p-1 text-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#5D0A72]/50"
//             >
//               <option value={5}>5</option>
//               <option value={10}>10</option>
//               <option value={20}>20</option>
//               <option value={50}>50</option>
//             </select>
//             <span>
//               Showing {indexOfFirstItem + 1} to{" "}
//               {Math.min(indexOfLastItem, sortedAppointments.length)} of{" "}
//               {sortedAppointments.length} entries
//             </span>
//           </div>

//           <div className="flex gap-2">
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               className={`px-3 py-1 rounded-md ${
//                 currentPage === 1
//                   ? "bg-[#03001c]/50 text-[#94A3B8]/50 cursor-not-allowed"
//                   : "bg-[#03001c] text-[#94A3B8] hover:bg-[#0A004A]/50"
//               }`}
//             >
//               Previous
//             </button>

//             {paginationItems()}

//             <button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages || totalPages === 0}
//               className={`px-3 py-1 rounded-md ${
//                 currentPage === totalPages || totalPages === 0
//                   ? "bg-[#03001c]/50 text-[#94A3B8]/50 cursor-not-allowed"
//                   : "bg-[#03001c] text-[#94A3B8] hover:bg-[#0A004A]/50"
//               }`}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// import { useState, RefObject, useMemo, useEffect } from "react";
// import SortableHeader from "@/components/ui/SortableHeader";
// import * as XLSX from 'xlsx';
// import { useToast } from "@/hooks/use-toast";
// import { Appointment, ColumnToggle } from "@/components/types/appointment";

// interface AppointmentsTableCardProps {
//   appointments: Appointment[];
//   setAppointments: (appointments: Appointment[]) => void;
//   selectedAppointments: number[];
//   setSelectedAppointments: (ids: number[]) => void;
//   columns: ColumnToggle[];
//   setColumns: (columns: ColumnToggle[]) => void;
//   showColumnSelector: boolean;
//   setShowColumnSelector: (value: boolean) => void;
//   columnSelectorRef: RefObject<HTMLDivElement>;
//   sortColumn: string | null;
//   setSortColumn: (column: string | null) => void;
//   sortOrder: "asc" | "desc" | null;
//   setSortOrder: (order: "asc" | "desc" | null) => void;
//   currentPage: number;
//   setCurrentPage: (page: number) => void;
//   itemsPerPage: number;
//   setItemsPerPage: (items: number) => void;
//   onAddClick: () => void;
//   onEditClick: (appointment: Appointment) => void;
//   onDeleteClick: (id: number) => void;
//   initialAppointments: Appointment[];
// }

// export default function AppointmentsTableCard({
//   appointments,
//   setAppointments,
//   selectedAppointments,
//   setSelectedAppointments,
//   columns,
//   setColumns,
//   showColumnSelector,
//   setShowColumnSelector,
//   columnSelectorRef,
//   sortColumn,
//   setSortColumn,
//   sortOrder,
//   setSortOrder,
//   currentPage,
//   setCurrentPage,
//   itemsPerPage,
//   setItemsPerPage,
//   onAddClick,
//   onEditClick,
//   onDeleteClick,
//   initialAppointments,
// }: AppointmentsTableCardProps) {
//   const { toast } = useToast();
//   const [selectAll, setSelectAll] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Apply search filter first
//   const filteredAppointments = useMemo(() => {
//     if (!searchTerm.trim()) {
//       return appointments;
//     }

//     const lowerCaseSearch = searchTerm.toLowerCase().trim();

//     return appointments.filter(appointment => {
//       return (
//         appointment.patientName.toLowerCase().includes(lowerCaseSearch) ||
//         appointment.doctor.toLowerCase().includes(lowerCaseSearch) ||
//         appointment.issue.toLowerCase().includes(lowerCaseSearch) ||
//         appointment.status.toLowerCase().includes(lowerCaseSearch) ||
//         appointment.visitType.toLowerCase().includes(lowerCaseSearch) ||
//         appointment.email.toLowerCase().includes(lowerCaseSearch) ||
//         appointment.phone.toLowerCase().includes(lowerCaseSearch)
//       );
//     });
//   }, [appointments, searchTerm]);

//   // Then sort the filtered appointments
//   const sortedAppointments = useMemo(() => {
//     return [...filteredAppointments].sort((a, b) => {
//       if (sortOrder === null || sortColumn === null) {
//         return a.id - b.id; // Default sort by ID
//       }

//       const sortMultiplier = sortOrder === "asc" ? 1 : -1;

//       switch (sortColumn) {
//         case "id":
//           return sortMultiplier * (a.id - b.id);
//         case "patientName":
//           return sortMultiplier * a.patientName.localeCompare(b.patientName);
//         case "doctor":
//           return sortMultiplier * a.doctor.localeCompare(b.doctor);
//         case "gender":
//           return sortMultiplier * a.gender.localeCompare(b.gender);
//         case "date": {
//           // Convert dates for proper comparison (MM/DD/YYYY format)
//           const dateA = new Date(a.date).getTime();
//           const dateB = new Date(b.date).getTime();
//           return sortMultiplier * (dateA - dateB);
//         }
//         case "time": {
//           // Convert times for comparison
//           const timeA = a.time.split(":").map(Number);
//           const timeB = b.time.split(":").map(Number);
//           const minutesA = timeA[0] * 60 + timeA[1];
//           const minutesB = timeB[0] * 60 + timeB[1];
//           return sortMultiplier * (minutesA - minutesB);
//         }
//         case "injury":
//           return sortMultiplier * a.issue.localeCompare(b.issue);
//         case "status":
//           return sortMultiplier * a.status.localeCompare(b.status);
//         case "visitType":
//           return sortMultiplier * a.visitType.localeCompare(b.visitType);
//         default:
//           return 0;
//       }
//     });
//   }, [filteredAppointments, sortColumn, sortOrder]);

//   // Update selectAll state whenever selectedAppointments or sortedAppointments change
//   useEffect(() => {
//     if (sortedAppointments.length === 0) {
//       setSelectAll(false);
//     } else {
//       setSelectAll(selectedAppointments.length === sortedAppointments.length);
//     }
//   }, [selectedAppointments, sortedAppointments]);

//   // Pagination calculations
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;

//   // Get current page of appointments
//   const currentAppointments = useMemo(() => {
//     return sortedAppointments.slice(indexOfFirstItem, indexOfLastItem);
//   }, [sortedAppointments, indexOfFirstItem, indexOfLastItem]);

//   // Total pages for pagination
//   const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);

//   const handleSortClick = (column: string) => {
//     if (sortColumn === column) {
//       const nextOrder = 
//         sortOrder === "asc" ? "desc" :
//         sortOrder === "desc" ? null : 
//         "asc";

//       if (nextOrder === null) {
//         setSortColumn(null);
//         setSortOrder(null);
//       } else {
//         setSortOrder(nextOrder);
//       }
//     } else {
//       setSortColumn(column);
//       setSortOrder("asc");
//     }
//   };

//   const toggleColumnVisibility = (columnId: string) => {
//     setColumns(
//       columns.map((column) =>
//         column.id === columnId
//           ? { ...column, visible: !column.visible }
//           : column,
//       ),
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedAppointments([]);
//     } else {
//       setSelectedAppointments(
//         sortedAppointments.map((appointment) => appointment.id),
//       );
//     }
//   };

//   const handleSelectAppointment = (id: number) => {
//     if (selectedAppointments.includes(id)) {
//       setSelectedAppointments(
//         selectedAppointments.filter((appointmentId) => appointmentId !== id),
//       );
//     } else {
//       setSelectedAppointments([...selectedAppointments, id]);
//     }
//   };

//   const handleBulkDelete = () => {
//     if (selectedAppointments.length === 0) return;

//     const updatedAppointments = appointments.filter(
//       appointment => !selectedAppointments.includes(appointment.id)
//     );

//     setAppointments(updatedAppointments);

//     toast({
//       title: "Appointments Deleted",
//       description: `${selectedAppointments.length} appointment${selectedAppointments.length > 1 ? 's' : ''} successfully removed.`,
//       variant: "destructive",
//       className: "bg-[#450A0A] border border-red-700/50 text-white",
//     });

//     setSelectedAppointments([]);
//   };

//   const handleRefreshTable = () => {
//     setAppointments(initialAppointments);
//     setSelectedAppointments([]);
//     setCurrentPage(1);
//     setSortColumn(null);
//     setSortOrder(null);
//     setSearchTerm("");

//     toast({
//       title: "Table Refreshed",
//       description: "Appointments data has been refreshed.",
//       className: "bg-[#05002E] border border-[#5D0A72]/20 text-white",
//     });
//   };

//   const handleXlsxDownload = () => {
//     try {
//       const exportData = sortedAppointments.map((appointment: Appointment) => ({
//         'Patient Name': appointment.patientName,
//         'Doctor': appointment.doctor,
//         'Gender': appointment.gender,
//         'Date': appointment.date,
//         'Time': appointment.time,
//         'Phone': appointment.phone,
//         'Issue': appointment.issue,
//         'Email': appointment.email,
//         'Status': appointment.status,
//         'Visit Type': appointment.visitType
//       }));

//       const worksheet = XLSX.utils.json_to_sheet(exportData);
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");
//       XLSX.writeFile(workbook, "Cliniva_Appointments.xlsx");

//       toast({
//         title: "Export Successful",
//         description: "Appointments data has been exported to Excel.",
//         className: "bg-[#05002E] border border-[#5D0A72]/20 text-white",
//       });
//     } catch (error) {
//       toast({
//         title: "Export Failed",
//         description: "There was an error exporting the data.",
//         variant: "destructive",
//       });
//       console.error("Export error:", error);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Completed":
//         return "bg-green-100 text-green-800";
//       case "Scheduled":
//         return "bg-blue-100 text-blue-800";
//       case "Cancelled":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getAvatarBg = (gender: string) => {
//     return gender === "female" ? "bg-pink-200" : "bg-blue-200";
//   };

//   const handlePageChange = (newPage: number) => {
//     setCurrentPage(newPage);
//   };

//   const handleItemsPerPageChange = (
//     e: React.ChangeEvent<HTMLSelectElement>,
//   ) => {
//     setItemsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   // Generate pagination items
//   const paginationItems = () => {
//     const items = [];
//     const maxPagesToShow = 5;
//     const startPage = Math.max(
//       1,
//       currentPage - Math.floor(maxPagesToShow / 2),
//     );
//     const endPage = Math.min(
//       totalPages,
//       startPage + maxPagesToShow - 1,
//     );

//     for (let i = startPage; i <= endPage; i++) {
//       items.push(
//         <button
//           key={i}
//           onClick={() => handlePageChange(i)}
//           className={`px-3 py-1 rounded-md ${
//             currentPage === i
//               ? "bg-[#3466ad] text-white"
//               : "bg-[#02001E] text-[#94A3B8] hover:bg-[#0A004A]/50"
//           }`}
//         >
//           {i}
//         </button>,
//       );
//     }
//     return items;
//   };

//   return (
//     <div
//       style={{
//         padding: "2px",
//         borderRadius: "1rem",
//         background:
//           "conic-gradient(#072f93 0deg, #03115e 45deg, #031b78 90deg, #0f42c1 135deg, #021a70 180deg, #031a63 225deg, #0a70d2 270deg, #0e82ea 315deg, #072f93 360deg)",
//         display: "grid",
//         boxShadow: `
//           0 4px 8px rgba(7, 47, 147, 0.3),
//           0 0 12px rgba(14, 130, 234, 0.4),
//         `,
//       }}
//     >
//       <div
//         className="bg-[#05002E] rounded-xl overflow-hidden shadow-lg"
//         style={{
//           boxShadow: `inset 0 2px 4px rgba(3, 17, 94, 0.6),
//                       inset 0 -2px 6px rgba(2, 26, 112, 0.8)`,
//         }}
//       >
//         <div className="p-5 flex items-center justify-between border-b border-[#5D0A72]/10">
//           <div className="flex items-center gap-2">
//             <div className="relative w-64">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4 text-[#94A3B8]/70"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <circle cx="11" cy="11" r="8" />
//                   <line x1="21" y1="21" x2="16.65" y2="16.65" />
//                 </svg>
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search"
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   setCurrentPage(1); // Reset to first page when searching
//                 }}
//                 className="bg-[#02001E] text-sm py-2 pl-10 pr-4 rounded-lg text-[#94A3B8] placeholder-[#94A3B8]/50 focus:outline-none focus:ring-1 focus:ring-[#5D0A72]/50 border border-[#5D0A72]/10 w-full"
//               />
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             {selectedAppointments.length > 0 && (
//               <div className="relative parent-container">
//                 <button
//                   onClick={handleBulkDelete}
//                   className="relative bg-[#450A0A] text-white p-2 rounded-lg hover:bg-[#5A0000] transition-colors border border-red-700/40 group"
//                 >
//                   <span className="absolute invisible group-hover:visible bg-[#450A0A] text-white text-xs px-2 py-1 rounded-lg -bottom-full left-1/2 transform -translate-x-1/2 z-50">
//                     Delete {selectedAppointments.length} Selected
//                   </span>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <path d="M3 6h18" />
//                     <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
//                     <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
//                     <line x1="10" y1="11" x2="10" y2="17" />
//                     <line x1="14" y1="11" x2="14" y2="17" />
//                   </svg>
//                 </button>
//               </div>
//             )}

//             <div className="relative parent-container">
//               <button
//                 onClick={handleRefreshTable}
//                 className="relative bg-[#05002E] text-[#94A3B8] p-2 rounded-lg hover:bg-[#0A004A]/20 transition-colors border border-[#5D0A72]/10 group"
//               >
//                 <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-full left-1/2 transform -translate-x-1/2 z-50">
//                   Refresh Table
//                 </span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
//                   <path d="M21 3v5h-5" />
//                   <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
//                   <path d="M8 16H3v5" />
//                 </svg>
//               </button>
//             </div>

//             <div className="relative parent-container">
//               <button
//                 onClick={handleXlsxDownload}
//                 className="relative bg-[#05002E] text-[#94A3B8] p-2 rounded-lg hover:bg-[#0A004A]/20 transition-colors border border-[#5D0A72]/10 group"
//               >
//                 <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-full left-1/2 transform -translate-x-1/2 z-50">
//                   Export to Excel
//                 </span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
//                   <polyline points="14 2 14 8 20 8" />
//                   <path d="M8 13h2" />
//                   <path d="M8 17h2" />
//                   <path d="M14 13h2" />
//                   <path d="M14 17h2" />
//                 </svg>
//               </button>
//             </div>

//             <div className="relative parent-container">
//               <button
//                 onClick={() => setShowColumnSelector(!showColumnSelector)}
//                 className="relative bg-[#05002E] text-[#94A3B8] p-2 rounded-lg hover:bg-[#0A004A]/20 transition-colors border border-[#5D0A72]/10 group"
//               >
//                 <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-full left-1/2 transform -translate-x-1/2 z-50">
//                   Show/Hide Columns
//                 </span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   viewBox="0 0 24 24"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     clipRule="evenodd"
//                     d="M3 7C3 6.44772 3.44772 6 4 6H20C20.5523 6 21 6.44772 21 7C21 7.55228 20.5523 8 20 8H4C3.44772 8 3 7.5523 3 7ZM6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12ZM9 17C9 16.4477 9.44772 16 10 16H14C14.5523 16 15 16.4477 15 17C15 17.5523 14.5523 18 14 18H10C9.44772 18 9 17.5523 9 17Z"
//                     fill="currentColor"
//                   />
//                 </svg>
//               </button>

//               {showColumnSelector && (
//                 <div
//                   ref={columnSelectorRef}
//                   className="absolute top-12 right-0 z-30 w-64 bg-[#f2f2f4] rounded-lg shadow-lg border border-[#5D0A72]/10 overflow-hidden"
//                   style={{ maxHeight: "400px", overflowY: "auto" }}
//                 >
//                   <div className="sticky top-0 bg-[#e9eaec] p-3 border-b border-gray-300">
//                     <h3 className="text-gray-700 font-medium text-base">
//                       Show/Hide Column
//                     </h3>
//                   </div>
//                   <div className="overflow-y-auto">
//                     {columns.map((column) => (
//                       <div
//                         key={column.id}
//                         className="flex items-center px-4 py-3 hover:bg-gray-100 border-b border-gray-200"
//                       >
//                         <input
//                           type="checkbox"
//                           id={`column-${column.id}`}
//                           checked={column.visible}
//                           onChange={() => toggleColumnVisibility(column.id)}
//                           className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                         />
//                         <label
//                           htmlFor={`column-${column.id}`}
//                           className="ml-3 text-sm text-gray-700 cursor-pointer"
//                         >
//                           {column.label}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="relative parent-container">
//               <button
//                 onClick={onAddClick}
//                 className="relative bg-[#05002E] text-[#94A3B8] p-2 rounded-lg hover:bg-[#0A004A]/20 transition-colors border border-[#5D0A72]/10 group"
//               >
//                 <span className="absolute invisible group-hover:visible bg-[#3466ad] text-white text-xs px-2 py-1 rounded-lg -bottom-full left-1/2 transform -translate-x-1/2 z-50">
//                   Add New Appointment
//                 </span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                 >
//                   <circle
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="1.5"
//                   />
//                   <path
//                     d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
//                     stroke="currentColor"
//                     strokeWidth="1.5"
//                     strokeLinecap="round"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="overflow-x-auto p-4 bg-[#05002E]">
//           <table className="w-full bg-[#05002E]">
//             <thead>
//               <tr className="text-left text-[#94A3B8] bg-[#03001c]">
//                 <th className="py-4 px-6 font-medium rounded-l-lg">
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={selectAll}
//                       onChange={handleSelectAll}
//                       className="rounded border-[#5D0A72]/30 text-[#5D0A72] focus:ring-[#5D0A72]/30 h-4 w-4"
//                     />
//                   </div>
//                 </th>
//                 {columns.find((c) => c.id === "name")?.visible && (
//                   <SortableHeader
//                     label="Name"
//                     columnKey="patientName"
//                     sortColumn={sortColumn}
//                     sortOrder={sortOrder}
//                     onSort={handleSortClick}
//                   />
//                 )}
//                 {columns.find((c) => c.id === "doctor")?.visible && (
//                   <SortableHeader
//                     label="Doctor"
//                     columnKey="doctor"
//                     sortColumn={sortColumn}
//                     sortOrder={sortOrder}
//                     onSort={handleSortClick}
//                   />
//                 )}
//                 {columns.find((c) => c.id === "gender")?.visible && (
//                   <SortableHeader
//                     label="Gender"
//                     columnKey="gender"
//                     sortColumn={sortColumn}
//                     sortOrder={sortOrder}
//                     onSort={handleSortClick}
//                   />
//                 )}
//                 {columns.find((c) => c.id === "date")?.visible && (
//                   <SortableHeader
//                     label="Date"
//                     columnKey="date"
//                     sortColumn={sortColumn}
//                     sortOrder={sortOrder}
//                     onSort={handleSortClick}
//                   />
//                 )}
//                 {columns.find((c) => c.id === "time")?.visible && (
//                   <SortableHeader
//                     label="Time"
//                     columnKey="time"
//                     sortColumn={sortColumn}
//                     sortOrder={sortOrder}
//                     onSort={handleSortClick}
//                   />
//                 )}
//                 {columns.find((c) => c.id === "mobile")?.visible && (
//                   <th className="py-4 px-6 font-medium">Mobile</th>
//                 )}
//                 {columns.find((c) => c.id === "injury")?.visible && (
//                   <SortableHeader
//                     label="Injury"
//                     columnKey="injury"
//                     sortColumn={sortColumn}
//                     sortOrder={sortOrder}
//                     onSort={handleSortClick}
//                   />
//                 )}
//                 {columns.find((c) => c.id === "email")?.visible && (
//                   <th className="py-4 px-6 font-medium">Email</th>
//                 )}
//                 {columns.find((c) => c.id === "status")?.visible && (
//                   <SortableHeader
//                     label="Status"
//                     columnKey="status"
//                     sortColumn={sortColumn}
//                     sortOrder={sortOrder}
//                     onSort={handleSortClick}
//                   />
//                 )}
//                 {columns.find((c) => c.id === "visitType")?.visible && (
//                   <SortableHeader
//                     label="Visit Type"
//                     columnKey="visitType"
//                     sortColumn={sortColumn}
//                     sortOrder={sortOrder}
//                     onSort={handleSortClick}
//                   />
//                 )}
//                 <th className="py-4 px-6 font-medium rounded-r-lg text-center">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-[#5D0A72]/10">
//               {currentAppointments.map((appointment) => (
//                 <tr
//                   key={appointment.id}
//                   className="text-[#94A3B8] hover:bg-[#02001e]/30 transition-colors even:bg-[#000041] cursor-pointer"
//                   onClick={(e) => {
//                     if ((e.target as HTMLElement).closest('input[type="checkbox"]') ||
//                         (e.target as HTMLElement).closest('button')) {
//                       return;
//                     }
//                     onEditClick(appointment);
//                   }}
//                 >
//                   <td className="py-4 px-6">
//                     <input
//                       type="checkbox"
//                       checked={selectedAppointments.includes(appointment.id)}
//                       onChange={() => handleSelectAppointment(appointment.id)}
//                       className="rounded border-[#5D0A72]/30 text-[#5D0A72] focus:ring-[#5D0A72]/30 h-4 w-4"
//                     />
//                   </td>
//                   {columns.find((c) => c.id === "name")?.visible && (
//                     <td className="py-4 px-6">
//                       <div className="flex items-center gap-3">
//                         <div
//                           className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium ${getAvatarBg(
//                             appointment.gender,
//                           )}`}
//                         >
//                           {appointment.patientName.charAt(0)}
//                         </div>
//                         <div className="truncate max-w-[120px]" title={appointment.patientName}>
//                           {appointment.patientName}
//                         </div>
//                       </div>
//                     </td>
//                   )}
//                   {columns.find((c) => c.id === "doctor")?.visible && (
//                     <td className="py-4 px-6">
//                       <div className="truncate max-w-[120px]" title={appointment.doctor}>
//                         {appointment.doctor}
//                       </div>
//                     </td>
//                   )}
//                   {columns.find((c) => c.id === "gender")?.visible && (
//                     <td className="py-4 px-6">
//                       {appointment.gender === "male" ? "Male" : "Female"}
//                     </td>
//                   )}
//                   {columns.find((c) => c.id === "date")?.visible && (
//                     <td className="py-4 px-6">{appointment.date}</td>
//                   )}
//                   {columns.find((c) => c.id === "time")?.visible && (
//                     <td className="py-4 px-6">{appointment.time}</td>
//                   )}
//                   {columns.find((c) => c.id === "mobile")?.visible && (
//                     <td className="py-4 px-6">
//                       <div className="truncate max-w-[120px]" title={appointment.phone}>
//                         {appointment.phone}
//                       </div>
//                     </td>
//                   )}
//                   {columns.find((c) => c.id === "injury")?.visible && (
//                     <td className="py-4 px-6">
//                       <div className="truncate max-w-[150px]" title={appointment.issue}>
//                         {appointment.issue}
//                       </div>
//                     </td>
//                   )}
//                   {columns.find((c) => c.id === "email")?.visible && (
//                     <td className="py-4 px-6">
//                       <div className="truncate max-w-[150px]" title={appointment.email}>
//                         {appointment.email}
//                       </div>
//                     </td>
//                   )}
//                   {columns.find((c) => c.id === "status")?.visible && (
//                     <td className="py-4 px-6">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
//                           appointment.status,
//                         )}`}
//                       >
//                         {appointment.status}
//                       </span>
//                     </td>
//                   )}
//                   {columns.find((c) => c.id === "visitType")?.visible && (
//                     <td className="py-4 px-6">
//                       <div className="truncate max-w-[120px]" title={appointment.visitType}>
//                         {appointment.visitType}
//                       </div>
//                     </td>
//                   )}
//                   <td className="py-4 px-6 text-center">
//                     <div className="flex items-center justify-center gap-3">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           onEditClick(appointment);
//                         }}
//                         className="text-blue-500 hover:text-blue-700 transition-colors"
//                       >
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-5 w-5"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         >
//                           <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
//                           <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
//                         </svg>
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           onDeleteClick(appointment.id);
//                         }}
//                         className="text-red-500 hover:text-red-700 transition-colors"
//                       >
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-5 w-5"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         >
//                           <path d="M3 6h18" />
//                           <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
//                           <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
//                           <line x1="10" y1="11" x2="10" y2="17" />
//                           <line x1="14" y1="11" x2="14" y2="17" />
//                         </svg>
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//               {currentAppointments.length === 0 && (
//                 <tr className="text-center">
//                   <td colSpan={12} className="py-6 text-[#94A3B8]">
//                     {searchTerm.trim()
//                       ? "No appointments matching your search"
//                       : "No appointments available"}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="p-4 bg-[#05002E] border-t border-[#5D0A72]/10 flex flex-col sm:flex-row justify-between items-center gap-4">
//           <div className="flex items-center gap-2 text-[#94A3B8] text-sm">
//             <span>Rows per page:</span>
//             <select
//               value={itemsPerPage}
//               onChange={handleItemsPerPageChange}
//               className="bg-[#03001c] border border-[#5D0A72]/10 rounded-md p-1 text-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#5D0A72]/50"
//             >
//               <option value={5}>5</option>
//               <option value={10}>10</option>
//               <option value={20}>20</option>
//               <option value={50}>50</option>
//             </select>
//             <span>
//               Showing {indexOfFirstItem + 1} to{" "}
//               {Math.min(indexOfLastItem, sortedAppointments.length)} of{" "}
//               {sortedAppointments.length} entries
//             </span>
//           </div>

//           <div className="flex gap-2">
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               className={`px-3 py-1 rounded-md ${
//                 currentPage === 1
//                   ? "bg-[#03001c]/50 text-[#94A3B8]/50 cursor-not-allowed"
//                   : "bg-[#03001c] text-[#94A3B8] hover:bg-[#0A004A]/50"
//               }`}
//             >
//               Previous
//             </button>

//             {paginationItems()}

//             <button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages || totalPages === 0}
//               className={`px-3 py-1 rounded-md ${
//                 currentPage === totalPages || totalPages === 0
//                   ? "bg-[#03001c]/50 text-[#94A3B8]/50 cursor-not-allowed"
//                   : "bg-[#03001c] text-[#94A3B8] hover:bg-[#0A004A]/50"
//               }`}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


