import React, { useState } from "react";
import { FiStar, FiSettings } from "react-icons/fi";
import { AiOutlineEye } from "react-icons/ai";
import { IconButton, TextField, Avatar } from "@mui/material";
import { IoMdFolderOpen } from "react-icons/io";
import { ColorLens, MoreVert } from "@mui/icons-material";

import formImage from "../assets/google-forms.png";

const FormHeader = () => {

  const [formTitle, setFormTitle] = useState("Untitled Form");




  return (
    <div className="p-4 bg-white shadow-md">
      <div className="flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
  <img className="w-10 h-10 object-contain" src={formImage} alt="Form Logo" />
          <TextField
            variant="standard"
            placeholder="Untitled Form"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            InputProps={{
              disableUnderline: true,
              className: "text-lg font-medium",
            }}
          />
         
        </div>

   
      </div>
    </div>
  );
};

export default FormHeader;