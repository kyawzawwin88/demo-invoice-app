import React from 'react';
import Logo from '../../../../../assets/logo.svg';
import ImageAvatar from '../../../../../assets/image-avatar.jpg';
import SunIcon from '../../../../../assets/icon-sun.svg';
import MoonIcon from '../../../../../assets/icon-moon.svg';
import { useAllFeatureLayoutContext } from '../../hooks/AllFeatureLayoutContext';

const LeftNavigationBar: React.FC = () => {
  const { theme, setTheme } = useAllFeatureLayoutContext();
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <nav className="fixed left-0 top-0 h-screen w-[80px] flex flex-col justify-between bg-primary-default dark:bg-surface-dark">
      <div className="p-2 text-white bg-gradient-to-b from-primary-default to-primary-light h-[80px] rounded-tr-[12px] rounded-br-[12px] flex items-center justify-center">
        <img src={Logo} alt="Logo" className="w-8 h-8" />
      </div>

      <div className="p-2 flex flex-col items-center justify-center h-40">
        <div 
          onClick={toggleTheme}
          className="w-8 h-8 flex items-center justify-center cursor-pointer mb-4 hover:opacity-80"
        >
          {theme === 'dark' ? (
            <img src={SunIcon} alt="Light mode" />
          ) : (
            <img src={MoonIcon} alt="Dark mode" className='text-white' fill='white' />
          )}
        </div>

        <div className="w-full h-[1px] bg-surface-darker my-4"></div>
        
        <div className="w-8 h-8 rounded-full bg-gray-600 hover:bg-gray-500 transition-colors flex items-center justify-center">
          <img src={ImageAvatar} alt="User Avatar" className="w-full h-full object-cover rounded-full" />
        </div>
      </div>
    </nav>
  );
};

export default LeftNavigationBar;
