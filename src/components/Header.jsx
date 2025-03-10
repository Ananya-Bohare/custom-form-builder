import MenuIcon from '@mui/icons-material/Menu';  // Updated import path
import { IconButton } from '@mui/material';  // Updated import path
import SearchIcon from '@mui/icons-material/Search';  // Updated import path
import formImage from '../assets/google-forms.png';
import AppsIcon from '@mui/icons-material/Apps';  // Updated import path
import Avatar from '@mui/material/Avatar';

const Header = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md">
      {/* Left Section */}
      <div className="flex items-center space-x-4">

        <img className="h-14" src={formImage} alt="Google Forms"/>
        <span className="text-xl font-semibold text-gray-800">Forms</span>
      </div>

      {/* Search Section 
      <div className="flex items-center bg-gray-100 p-2 rounded-lg w-1/3">
        <IconButton>
          <SearchIcon className="text-gray-600" />
        </IconButton>
        <input
          type="text"
          placeholder="Search forms"
          className="flex-grow bg-transparent border-none text-gray-600 placeholder-gray-500 focus:outline-none"
        />
      </div>*/}

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        
      </div>
    </div>
  );
};

export default Header;
