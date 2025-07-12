export const COLORS = {
  darkBg: '#070028',  // Oxford Blue - main background
  darkestBg: '#02001E', // Darkest Blue - used for card content
  cardBg: '#05002E', // Card Background Blue
  sidebarBg: '#0A0035', // Sidebar Background - slightly different from main bg
  lightBlue: '#3DB9FF', // Cyan Blue - used for morning text, chart elements
  federalBlue: '#0A004A', // Federal Blue - for gradients, buttons
  brightPurple: '#9747FF', // Bright Purple - for Sarah text, chart lines 
  pinkPurple: '#FF57E6', // Pink/Purple - for text gradients
  lightPurple: '#5D0A72', // Indigo Purple - for active elements
  pinkAccent: '#5E0453', // Palatinate Purple - for gradients
  orangeAccent: '#FF5757', // Orange Accent - for charts, alerts
  yellowAccent: '#FFB800', // Yellow Accent - for gradients
  greyText: '#94A3B8', // Grey for text and icons
  chartGrid: '#2A2040', // Grid lines in charts
};

export const GRADIENTS = {
  // Card gradients (background colors)
  purple: 'linear-gradient(135deg, #5D0A72 0%, #5E0453 100%)', // Purple card gradient
  orange: 'linear-gradient(135deg, #FF5757 0%, #FFB800 100%)', // Orange card gradient
  blue: 'linear-gradient(135deg, #0A004A 0%, #3DB9FF 100%)', // Blue card gradient
  purpleDark: 'linear-gradient(135deg, #3E0F23 0%, #5D0A72 100%)', // Dark purple card gradient
  
  // Main background gradients
  background: 'linear-gradient(135deg, #070028 0%, #080035 100%)', // Main bg gradient
  sidebar: 'linear-gradient(180deg, #0A0035 0%, #060026 100%)', // Sidebar gradient
  
  // Text gradients
  purpleText: 'linear-gradient(135deg, #FF57E6 0%, #9747FF 100%)', // For Sarah text
  blueText: 'linear-gradient(135deg, #0A004A 0%, #3DB9FF 100%)', // For graph elements
  
  // Chart gradients  
  chartPurple: 'linear-gradient(180deg, rgba(151, 71, 255, 0.5) 0%, rgba(151, 71, 255, 0) 100%)',
  chartOrange: 'linear-gradient(180deg, rgba(255, 87, 87, 0.5) 0%, rgba(255, 87, 87, 0) 100%)',
  chartBlue: 'linear-gradient(180deg, rgba(61, 185, 255, 0.5) 0%, rgba(61, 185, 255, 0) 100%)',
};

// Calendar Constants
export const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const WEEKDAYS_SHORT = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
export const WEEKDAYS_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Event Modal Constants
export const EVENT_MODAL_COLOR_OPTIONS = [
    { id: 'greenTeal', name: 'Green/Teal', value: 'from-green-500 to-teal-600' },
    { id: 'orangeRed', name: 'Orange/Red', value: 'from-orange-500 to-red-600' },
    { id: 'redPink', name: 'Red/Pink', value: 'from-red-500 to-pink-600' },
    { id: 'cyanBlue', name: 'Cyan/Blue', value: 'from-cyan-500 to-blue-600' },
    { id: 'purplePink', name: 'Purple/Pink', value: 'from-purple-600 to-pink-600' },
    { id: 'yellowAmber', name: 'Yellow/Amber', value: 'from-yellow-500 to-amber-600' },
    { id: 'blueIndigo', name: 'Blue/Indigo', value: 'from-blue-600 to-indigo-700' },
];

export const EVENT_MODAL_COMMON_EMOJIS = ['🎉', '💼', '✈️', '💪', '🎂', '🍕', '❤️', '✨', '📅', '📌', '💡', '💰', '📚', '⚽'];
