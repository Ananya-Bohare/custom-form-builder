import React, { useEffect, useState } from "react";
import FormRenderer from "./FormRenderer";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { darken } from 'polished';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Typography,
  TextField,
  Button,
  IconButton, Switch , Menu, MenuItem, Snackbar,ListItemIcon, Checkbox,
  Alert,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from '@mui/icons-material/Close'; 
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import PaletteIcon from "@mui/icons-material/Palette";

function FormBuilder() {
  const [showResponse, setShowResponse] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const param = useParams();
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [forms, setForms] = useState([]);
  const [pageBackgroundColor, setPageBackgroundColor] = useState("#e8f0fe");
  const [colorAnchorEl, setColorAnchorEl] = useState(null); // Anchor for color menu
  const colorMenuOpen = Boolean(colorAnchorEl);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [publishedLink, setPublishedLink] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
const [open, setOpen] = useState(false);
const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const colorPalette = [
    "#e8f0fe", // Light blue
    "#fce8e8", // Light pink
    "#f9f0d9", // Light yellow
    "#e6f4ea", // Light green
    "#e8dfed", // Light purple
    "#ffd1dc", // Light rose
    "#c1f0d6", // Light mint
    "#f0e68c", // Khaki
    "#add8e6", // Light blue
    "#fafad2", // Light goldenrod yellow
];

    useEffect(() => {
      const savedForms = JSON.parse(localStorage.getItem("forms")) || [];
      const currentForm = savedForms.find((form) => form.id === param.id);
     
      if (currentForm) {
        // If the form exists, set its data
        setForms([currentForm]);
        setTitle(currentForm.title);
        setDescription(currentForm.description || "");
      } else {
        // If the form doesn't exist, initialize a new form
        const newForm = {
          title: title,
          description: description,
          id: param.id,
          questions: [
            {
              id: uuid(),
              questionText: "",
              answerType: "",
              options: [],
              required: false, // Add required state
              responseValidation: false, 
              validationType: '', // Added validationType state
              validationCriteria: {}, // Added validationCriteria state
              customErrorMessage: '', // Added customErrorMessage state
            },
          ],
        };
        setForms([newForm]);
      }
    }, [param.id]);
  
    // Sync the title with the forms state
  useEffect(() => {
    if (forms.length > 0) {
      setForms((prevForms) =>
        prevForms.map((form) =>
          form.id === param.id ? { ...form, title: title , description: description} : form
        )
      );
    }
  }, [title, description, param.id]);
  
    // Save forms to localStorage whenever they change
    useEffect(() => {
      if (forms.length > 0) {
        const savedForms = JSON.parse(localStorage.getItem("forms")) || [];
        const updatedForms = savedForms.filter((form) => form.id !== param.id); // Remove the old version of the form
        updatedForms.push(forms[0]); // Add the updated form
        localStorage.setItem("forms", JSON.stringify(updatedForms));
        console.log("param.id:", param.id);
        console.log("forms:", forms);
      }
    }, [forms, param.id]);

    // Handle drag-and-drop reordering
  const onDragEnd = (result) => {
    const { destination, source } = result;

    // If dropped outside the list, do nothing
    if (!destination) {
      return;
    }

    // If dropped in the same place, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Reorder the questions
    const form = forms[0];
    const newQuestions = Array.from(form.questions);
    const [removed] = newQuestions.splice(source.index, 1);
    newQuestions.splice(destination.index, 0, removed);

    // Update the form with the new order
    const updatedForm = { ...form, questions: newQuestions };
    setForms([updatedForm]);
  };

    // Handle publishing the form
    const handlePublish = () => {
      const publishedForms = JSON.parse(localStorage.getItem("publishedForms")) || [];
      const formToPublish = forms.find((form) => form.id === param.id);
    
      if (formToPublish) {
        // Add a published flag and save to publishedForms
        formToPublish.published = true;
        formToPublish.pageBackgroundColor = pageBackgroundColor; // Save the background color
        const updatedPublishedForms = publishedForms.filter((form) => form.id !== param.id);
        updatedPublishedForms.push(formToPublish);
        localStorage.setItem("publishedForms", JSON.stringify(updatedPublishedForms));
    
        // Generate a shareable link to the read-only viewer
        const link = `${window.location.origin}/form/${param.id}/view`;
        setPublishedLink(link);
        setSnackbarOpen(true); // Show the link in a Snackbar
      }
    };

  // Handle closing the Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleQuestionTextChange = (formId, questionId, value, required, responseValidation) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === formId
          ? {
              ...form,
              questions: form.questions.map((question) =>
                question.id === questionId
                  ? { ...question, questionText: value , required, responseValidation}
                  : question
              )
            }
          : form
      )
    );
  };

  const handleAnswerTypeChange = (formId, questionId, value) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === formId
          ? {
              ...form,
              questions: form.questions.map((question) =>
                question.id === questionId
                  ? { ...question, answerType: value, options: [] }
                  : question
              )
            }
          : form
      )
    );
  };

  const handleOptionChange = (formId, questionId, optionIndex, value) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === formId
          ? {
              ...form,
              questions: form.questions.map((question) =>
                question.id === questionId
                  ? {
                      ...question,
                      options: question.options.map((option, index) =>
                        index === optionIndex ? value : option
                      ),
                    }
                  : question
              ),
            }
          : form
      )
    );
  };

  const handleAddOption = (formId, questionId) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === formId
          ? {
              ...form,
              questions: form.questions.map((question) =>
                question.id === questionId
                  ? { ...question, options: [...question.options, `Option ${question.options.length + 1}`] }
                  : question
              ),
            }
          : form
      )
    );
  };

  const handleDeleteOption = (formId, questionId, optionIndex) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === formId
          ? {
              ...form,
              questions: form.questions.map((question) =>
                question.id === questionId
                  ? {
                      ...question,
                      options: question.options.filter(
                        (_, index) => index !== optionIndex
                      ),
                    }
                  : question
              ),
            }
          : form
      )
    );
  };

  const handleAddQuestion = (formId) => {
    const newQuestion = {
      id: uuid(),
      questionText: "question ",
      answerType: "",
      options: []
    };
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === formId
          ? { ...form, questions: [...form.questions, newQuestion] }
          : form
      )
    );
  };

  const handleDeleteQuestion = (formId, questionId) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === formId
          ? {
              ...form,
              questions: form.questions.filter((q) => q.id !== questionId)
            }
          : form
      )
    );
  };

  const handleCopyQuestion = (formId, questionId) => {
    const copiedQuestion = {
      ...forms
        .find((form) => form.id === formId)
        .questions.find((q) => q.id === questionId)
    };
    copiedQuestion.id = uuid();
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === formId
          ? { ...form, questions: [...form.questions, copiedQuestion] }
          : form
      )
    );
  };

  const handleSaveForm = () => {
    // Perform your save logic here
    console.log(forms);
    setShowSaveButton(true);
  };

  const handleOpenForm = () => {
    setShowResponse(true);
  };

  const handleColorMenuOpen = (event) => {
    setColorAnchorEl(event.currentTarget);
};

const handleColorMenuClose = () => {
    setColorAnchorEl(null);
};

const handleColorChange = (color) => {
  setPageBackgroundColor(color);
  setColorAnchorEl(null);
};

const handleMenuOpen = (event, questionId) => {
  setAnchorEl(event.currentTarget);
  setOpen(true);
  setSelectedQuestionId(questionId);
};

const handleMenuClose = () => {
  setAnchorEl(null);
  setOpen(false);
  setSelectedQuestionId(null);
};

const handleResponseValidationToggle = (formId, questionId) => {
  setForms((prevForms) =>
    prevForms.map((form) =>
      form.id === formId
        ? {
            ...form,
            questions: form.questions.map((question) =>
              question.id === questionId
                ? { ...question, responseValidation: !question.responseValidation }
                : question
            ),
          }
        : form
    )
  );
  handleMenuClose();
};

const handleValidationTypeChange = (formId, questionId, value) => {
  setForms((prevForms) =>
    prevForms.map((form) =>
      form.id === formId
        ? {
            ...form,
            questions: form.questions.map((question) =>
              question.id === questionId
                ? { ...question, validationType: value, validationCriteria: {}, customErrorMessage: '' }
                : question
            ),
          }
        : form
    )
  );
};

const handleCriteriaChange = (formId, questionId, key, value) => {
  setForms((prevForms) =>
    prevForms.map((form) =>
      form.id === formId
        ? {
            ...form,
            questions: form.questions.map((question) =>
              question.id === questionId
                ? {
                    ...question,
                    validationCriteria: {
                      ...question.validationCriteria,
                      [key]: value,
                    },
                  }
                : question
            ),
          }
        : form
    )
  );
};

const handleCustomErrorMessageChange = (formId, questionId, value) => {
  setForms((prevForms) =>
    prevForms.map((form) =>
      form.id === formId
        ? {
            ...form,
            questions: form.questions.map((question) =>
              question.id === questionId
                ? { ...question, customErrorMessage: value }
                : question
            ),
          }
        : form
    )
  );
};

const renderValidationCriteria = (formId, questionId, validationType, validationCriteria, customErrorMessage) => {
  switch (validationType) {
    case 'number':
      return (
        <div className="mt-4 flex items-center space-x-2">
          <select
            value={validationCriteria.operator || ''}
            onChange={(e) => handleCriteriaChange(formId, questionId, 'operator', e.target.value)}
            className="p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="greaterThan">Greater than</option>
            <option value="greaterThanOrEqualTo">Greater than or equal to</option>
            <option value="lessThan">Less than</option>
            <option value="lessThanOrEqualTo">Less than or equal to</option>
            <option value="equalTo">Equal to</option>
            <option value="notEqualTo">Not equal to</option>
            <option value="between">Between</option>
            <option value="notBetween">Not Between</option>
            <option value="isNumber">Is number</option>
            <option value="isWholeNumber">Whole number</option>
            {/* Add other number operators */}
          </select>
          {validationCriteria.operator === "between" || validationCriteria.operator === "notBetween" ? (
          // Render two input fields for min and max values
          <div className="flex">
            <input
              type="number"
              value={validationCriteria.min || ''}
              onChange={(e) => handleCriteriaChange(formId, questionId, 'min', e.target.value)}
              placeholder="Min"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={validationCriteria.max || ''}
              onChange={(e) => handleCriteriaChange(formId, questionId, 'max', e.target.value)}
              placeholder="Max"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ) : (
          // Render a single input field for other operators
          <input
            type="number"
            value={validationCriteria.value || ''}
            onChange={(e) => handleCriteriaChange(formId, questionId, 'value', e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
        </div>
      );
      case 'text':
        return (
          <div className="mt-4 flex items-center space-x-2">
            <select
              value={validationCriteria.operator || ''}
              onChange={(e) => handleCriteriaChange(formId, questionId, 'operator', e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Operator</option>
              <option value="contains">Contains</option>
              <option value="doesNotContain">Does not contain</option>
              <option value="isEmail">Email</option>
              <option value="isURL">URL</option>
            </select>
            <input
              type="text"
              value={validationCriteria.value || ''}
              onChange={(e) => handleCriteriaChange(formId, questionId, 'value', e.target.value)}
              placeholder="Enter text"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={customErrorMessage}
              onChange={(e) => handleCustomErrorMessageChange(formId, questionId, e.target.value)}
              placeholder="Custom error text"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
        case 'length':
          return (
            <div className="mt-4 flex items-center space-x-2">
              <select
                value={validationCriteria.operator || ''}
                onChange={(e) => handleCriteriaChange(formId, questionId, 'operator', e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Operator</option>
                <option value="maxChars">Maximum character count</option>
                <option value="minChars">Minimum character count</option>
              </select>
              <input
                type="number"
                value={validationCriteria.value || ''}
                onChange={(e) => handleCriteriaChange(formId, questionId, 'value', e.target.value)}
                placeholder="Enter number"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={customErrorMessage}
                onChange={(e) => handleCustomErrorMessageChange(formId, questionId, e.target.value)}
                placeholder="Custom error text"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          );
       {/*}   case 'regex':
            return (
              <div className="mt-4 flex items-center space-x-2">
                <select
                  value={validationCriteria.operator || ''}
                  onChange={(e) => handleCriteriaChange(formId, questionId, 'operator', e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  
                  <option value="regexContains">Contains</option>
                  <option value="regexDoesNotContain">Doesn't contain</option>
                  <option value="regexMatches">Matches</option>
                  <option value="regexDoesNotMatch">Doesn't match</option>
                </select>
                <input
                  type="text"
                  value={validationCriteria.value || ''}
                  onChange={(e) => handleCriteriaChange(formId, questionId, 'value', e.target.value)}
                  placeholder="Enter regex"
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={customErrorMessage}
                  onChange={(e) => handleCustomErrorMessageChange(formId, questionId, e.target.value)}
                  placeholder="Custom error text"
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            );*/}
    default:
      return null;
  }
};

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: pageBackgroundColor }}>

      {!showResponse &&
        forms.map((form) => (
          <div 
          key={form.id} 
          className="bg-white mb-6 rounded-lg shadow-lg max-w-4xl mx-auto"
          >
            
          {/* Header Section */}
          <div
    className="p-6 mb-6 rounded-lg bg-white shadow-lg relative"
    style={{ borderTop: `8px solid ${darken(0.3, pageBackgroundColor)}` }}
>
    {/* Top-right buttons */}
    <div className="absolute top-4 right-4 flex items-center space-x-3">
        <IconButton onClick={handleColorMenuOpen}>
            <PaletteIcon className="text-gray-600" />
        </IconButton>
        <Menu
            anchorEl={colorAnchorEl}
            open={colorMenuOpen}
            onClose={handleColorMenuClose}
            PaperProps={{
                style: {
                    borderRadius: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    maxWidth: '200px', // Set max width for the menu
                },
            }}
        >
            <div className="grid grid-cols-5 gap-0.1"> {/* Reduced gap and columns */}
                {colorPalette.map((color) => (
                    <MenuItem
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className="p-4 rounded-full transition"
                    >
                        <div
                            style={{
                                width: '50px', 
                                height: '10px',
                                backgroundColor: color,
                                borderRadius: '1px',
                                boxShadow: '0 0 3px rgba(0,0,0,0.2)',
                            }}
                        ></div>
                    </MenuItem>
                ))}
            </div>
        </Menu>
        <Button variant="contained" color="inherit" className="font-medium py-2 px-4" onClick={handlePublish}>
            PUBLISH
        </Button>
    </div>

    {/* Form title and description */}
    <div className="flex flex-col mt-10 space-y-4">
        <TextField
            className="w-full bg-gray-50 focus:bg-white border border-gray-300 focus:border-blue-500 rounded-lg p-3 text-lg font-medium"
            type="text"
            placeholder="Untitled Form"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            size="medium"
            InputProps={{
                style: {
                    padding: '10px 14px',
                    borderRadius: '8px',
                },
            }}
        />
        <TextField
            className="w-full bg-gray-50 focus:bg-white border border-gray-300 focus:border-blue-500 rounded-lg p-3 text-lg"
            placeholder="Form description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="outlined"
            size="medium"
            multiline
            rows={3}
            InputProps={{
                style: {
                    padding: '10px 14px',
                    borderRadius: '8px',
                },
            }}
        />
    </div>
</div>

{/* Drag-and-Drop Context */}
<DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="questions">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
            
            {form.questions.map((question, index) => (
              <Draggable key={question.id} draggableId={question.id} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps} 
              className="mb-6 p-4 bg-gray-100 rounded-md shadow-sm">

                <div className="mb-4">
                <input
                  className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Question Text"
                  value={question.questionText}
                  onChange={(e) =>
                    handleQuestionTextChange(form.id, question.id, e.target.value)
                  }
                />
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={question.answerType}
                  onChange={(e) =>
                    handleAnswerTypeChange(form.id, question.id, e.target.value)
                  }
                >
                  <option value="">Select Answer Type</option>
                  <option value="input">Input</option>
                  <option value="short answer">Short Answer</option>
                  <option value="paragraph">Paragraph</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="radio">Multiple choice</option>
                  <option value="dropdown">Dropdown</option>
                  <option value="date">Date</option>
                  <option value="time">Time</option>
                </select>
              </div>

              {question.answerType === "checkbox" && (
  <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
    <Typography variant="subtitle2" className="text-gray-700 mb-2">
      Options
    </Typography>
    {question.options.map((option, index) => (
      <div
        key={index}
        className="flex items-center mb-2 bg-white rounded-lg shadow-sm p-2"
      >
        <TextField
          label={`Option ${index + 1}`}
          value={option}
          onChange={(e) =>
            handleOptionChange(
              form.id,
              question.id,
              index,
              e.target.value
            )
          }
          fullWidth
          className="mr-2"
          variant="outlined"
          size="small"
        />
        <Button
          className="text-red-600 hover:text-red-800 transition"
          onClick={() => handleDeleteOption(form.id, question.id, index)} // Pass optionIndex here
        >
          <CloseIcon />
        </Button>
        
      </div>
    ))}
    <Button
      onClick={() => handleAddOption(form.id, question.id)}
      className="text-blue-600 hover:text-blue-800 transition">
      <AddIcon />
      Option
    </Button>
  </div>
              )}

              {question.answerType === "radio" && (
  <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
    <Typography variant="subtitle2" className="text-gray-700 mb-2">
      Options
    </Typography>
    {question.options.map((option, index) => (
      <div
        key={index}
        className="flex items-center mb-2 bg-white rounded-lg shadow-sm p-2"
      >
        <TextField
          label={`Option ${index + 1}`}
          value={option}
          onChange={(e) =>
            handleOptionChange(form.id, question.id, index, e.target.value)
          }
          fullWidth
          className="mr-2"
          variant="outlined"
          size="small"
        />
        <Button
          className="text-red-600 hover:text-red-800 transition"
          onClick={() => handleDeleteOption(form.id, question.id, index)} // Pass optionIndex here
        >
          <CloseIcon />
        </Button>
        
      </div>
    ))}
    <Button
      onClick={() => handleAddOption(form.id, question.id)}
      className="text-blue-600 hover:text-blue-800 transition">
      <AddIcon />
      Option
    </Button>
  </div>
              )}

{question.answerType === "dropdown" && (
  <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
    <Typography variant="subtitle2" className="text-gray-700 mb-2">
      Dropdown Options
    </Typography>
    {question.options.map((option, index) => (
      <div
        key={index}
        className="flex items-center mb-2 bg-white rounded-lg shadow-sm p-2"
      >
        <TextField
          label={`Option ${index + 1}`}
          value={option}
          onChange={(e) =>
            handleOptionChange(form.id, question.id, index, e.target.value)
          }
          fullWidth
          className="mr-2"
          variant="outlined"
          size="small"
        />
        <Button
          className="text-red-600 hover:text-red-800 transition"
          onClick={() => handleDeleteOption(form.id, question.id, index)} // Pass optionIndex here
        >
          <CloseIcon />
        </Button>


      </div>
    ))}
    <Button
      onClick={() => handleAddOption(form.id, question.id)}
      className="text-blue-600 hover:text-blue-800 transition"
    >
      <AddIcon />
      Add Option
    </Button>
  </div>
)}

{question.answerType === "short answer" && (
  <TextField
    placeholder="Short Answer"
    fullWidth
    variant="outlined"
    size="small"
    className="mb-2"
  />
)}

{question.answerType === "paragraph" && (
  <TextField
    placeholder="Paragraph"
    fullWidth
    variant="outlined"
    size="small"
    multiline
    rows={4}
    className="mb-2"
  />
)}

{question.answerType === "date" && (
    <TextField
      type="date"
      fullWidth
      variant="outlined"
      size="small"
      className="mb-2"
    />
  )}

{question.answerType === "time" && (
  <TextField
    type="time"
    fullWidth
    variant="outlined"
    size="small"
    className="mb-2"
  />
)}

{question.responseValidation && (
      <div className="mt-4 p-4 bg-gray-50 rounded-md">
        <select
          value={question.validationType}
          onChange={(e) => handleValidationTypeChange(form.id, question.id, e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Validation Type</option>
          <option value="number">Number</option>
          <option value="text">Text</option>
          <option value="length">Length</option>
       {/*}   <option value="regex">Regular expression</option>*/}
        </select>

        {/* Render criteria based on validation type */}
        {renderValidationCriteria(form.id, question.id, question.validationType, question.validationCriteria, question.customErrorMessage)}
      </div>
    )}

              <div className="flex justify-end mt-4 space-x-2">
                
                <button
                  className="text-red-600 hover:text-red-800 transition"
                  onClick={() =>
                    handleDeleteQuestion(form.id, question.id)
                  }
                >
                  <DeleteIcon />
                </button>

                <button
                  className="text-blue-600 hover:text-blue-800 transition"
                  onClick={() =>
                    handleCopyQuestion(form.id, question.id)
                  }
                >
                  <FileCopyIcon />
                </button>

                <label className="flex items-center space-x-2">
        <Switch
          checked={question.required}
          onChange={(e) =>
            handleQuestionTextChange(
              form.id,
              question.id,
              question.questionText,
              e.target.checked,
              question.responseValidation
            )
          }
          color="primary" // Or another color
        />
        <span>Required</span>
      </label>
      <div className="relative">
        <IconButton onClick={(e) => handleMenuOpen(e, question.id)}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open && selectedQuestionId === question.id}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleResponseValidationToggle(form.id, question.id)}>
            <ListItemIcon>
              <Checkbox checked={question.responseValidation} />
            </ListItemIcon>
            Response validation
          </MenuItem>
          {/* Add other menu items (Show, Description) here */}
        </Menu>
      </div>

                
              </div>

              
            </div>
              )}
            </Draggable>
            
            ))}
            
            </div>
            
            )}
            </Droppable>
             </DragDropContext>
            <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            onClick={() => handleAddQuestion(form.id)}
          >
            Add Question
          </button>
          </div>
        ))}

        {/* Snackbar for Published Link */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          Form published! Share this link:{" "}
          <a href={publishedLink} target="_blank" rel="noopener noreferrer">
            {publishedLink}
          </a>
        </Alert>
      </Snackbar>
      
      {showResponse && (
  <FormRenderer
    formData={forms}
    id={param.id}
    setShowResponse={setShowResponse}
    title={title}
    description={description}
    pageBackgroundColor={pageBackgroundColor} // Pass the background color
  />
)}
    </div>
  );
}

export default FormBuilder;