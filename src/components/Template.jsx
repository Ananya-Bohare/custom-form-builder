import React, { useEffect, useState } from "react";
import { v1 as uuidv1 } from "uuid";
import { useNavigate } from "react-router-dom";
import { FaPlus } from 'react-icons/fa';
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Template = () => {
  let navigate = useNavigate();
  const [savedForms, setSavedForms] = useState([]);
  // State for managing the menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFormId, setSelectedFormId] = useState(null);

  useEffect(() => {
    const forms = JSON.parse(localStorage.getItem("forms")) || [];
    setSavedForms(forms);
  }, []);

  const createFormHandle = () => {
    const id = uuidv1();
    navigate("/form/" + id, { state: { id } }); 
  };

  const openForm = (id) => {
    navigate("/form/" + id, { state: { id } });
  };

  // Handle menu open
  const handleMenuOpen = (event, formId) => {
    setAnchorEl(event.currentTarget);
    setSelectedFormId(formId);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFormId(null);
  };

  // Handle form deletion
  const handleDeleteForm = () => {
    if (selectedFormId) {
      // Filter out the form to be deleted
      const updatedForms = savedForms.filter((form) => form.id !== selectedFormId);

      // Update localStorage
      localStorage.setItem("forms", JSON.stringify(updatedForms));

      // Update state
      setSavedForms(updatedForms);

      // Close the menu
      handleMenuClose();
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-r from-gray-100 to-gray-200 min-h-screen">
      

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {savedForms.map((form) => (
          <div
            key={form.id}
            className="flex items-center justify-center p-6 bg-white rounded-xl shadow-lg cursor-pointer transition-transform transform hover:scale-105 border border-gray-300 hover:shadow-xl"
            onClick={() => openForm(form.id)}
          >
            <h3 className="text-lg font-semibold text-gray-700">{form.title || "Untitled Form"}</h3>
          {/* Menu Button */}
          <div className="absolute top-2 right-2">
              <IconButton
                aria-label="more"
                aria-controls="form-menu"
                aria-haspopup="true"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the card click event from firing
                  handleMenuOpen(e, form.id);
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center mt-8">
        <div
          className="flex items-center justify-center w-32 h-32 bg-white rounded-xl shadow-lg cursor-pointer transition-transform transform hover:scale-110 border border-gray-300 hover:shadow-xl"
          onClick={createFormHandle}
        >
          <FaPlus className="text-blue-500 text-4xl" />
        </div>
        <p className="text-gray-600 mt-2">Create New Form</p>
      </div>
      {/* Dropdown Menu */}
      <Menu
        id="form-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDeleteForm}>Delete</MenuItem>
      </Menu>
    </div>
  );
};

export default Template;