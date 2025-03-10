import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { darken } from "polished";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
  TextField,
  Button,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

function FormRenderer() {
  const { id } = useParams(); // Get the form ID from the URL
  const [formResponses, setFormResponses] = useState([]); // Store user responses
  const [formData, setFormData] = useState(null); // Store the form data
  const [validationErrors, setValidationErrors] = useState({}); // Track validation errors
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Load form data from localStorage when the component mounts
  useEffect(() => {
    const publishedForms = JSON.parse(localStorage.getItem("publishedForms")) || [];
    const currentForm = publishedForms.find((form) => form.id === id);

    if (currentForm) {
      setFormData(currentForm);
    }
  }, [id]);

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Validate responses
    const errors = validateResponses(formData.questions, formResponses);

    if (Object.keys(errors).length > 0) {
      // Show validation errors
      setValidationErrors(errors);
      return;
    }

    // If no errors, proceed with form submission
    console.log("Form Responses:", formResponses);
    setValidationErrors({}); // Clear validation errors
    setIsSubmitted(true);
  };

  // Validate responses
  const validateResponses = (questions, responses) => {
    const errors = {};
  
    questions.forEach((question, index) => {
      const response = responses[index];
  
      // Check if the question is required
      if (question.required) {
        if (
          !response ||
          (Array.isArray(response) && response.length === 0) ||
          (typeof response === "string" && response.trim() === "")
        ) {
          errors[index] = question.customErrorMessage || "This question is required.";
        }
      }
  
      // Check response validation criteria
      if (question.responseValidation && response) {
        const { validationType, validationCriteria } = question;
  
        switch (validationType) {
          case "number":
            if (!validateNumber(response, validationCriteria)) {
              errors[index] =
                question.customErrorMessage || "Invalid number. Please check the criteria.";
            }
            break;
  
          case "text":
            if (!validateText(response, validationCriteria)) {
              errors[index] =
                question.customErrorMessage || "Invalid text. Please check the criteria.";
            }
            break;
  
          case "length":
            if (!validateLength(response, validationCriteria)) {
              errors[index] =
                question.customErrorMessage || "Invalid length. Please check the criteria.";
            }
            break;
  
          case "regex":
            if (!validateRegex(response, validationCriteria)) {
              errors[index] =
                question.customErrorMessage || "Invalid input. Please check the criteria.";
            }
            break;
  
          default:
            break;
        }
      }
    });
  
    return errors;
  };

  // Validate number responses
  const validateNumber = (response, criteria) => {
    const num = parseFloat(response);
  
    // Check if the response is a valid number
    if (isNaN(num)) {
      return false; // Invalid number
    }
  
    switch (criteria.operator) {
      case "greaterThan":
        return num > criteria.value;
      case "greaterThanOrEqualTo":
        return num >= criteria.value;
      case "lessThan":
        return num < criteria.value;
      case "lessThanOrEqualTo":
        return num <= criteria.value;
      case "equalTo":
        return num === criteria.value;
      case "notEqualTo":
        return num !== criteria.value;
      case "between":
        return num >= criteria.min && num <= criteria.max;
      case "notBetween":
        return num < criteria.min || num > criteria.max;
      case "isNumber":
        return !isNaN(num); // Check if it's a valid number
      case "isWholeNumber":
        return Number.isInteger(num); // Check if it's a whole number
      default:
        return true; // No validation error
    }
  };

  // Validate text responses
  const validateText = (response, criteria) => {
    if (!response) return false; // If the response is empty, validation fails
  
    switch (criteria.operator) {
      case "contains":
        return response.includes(criteria.value); // Return true if the response contains the value
      case "doesNotContain":
        return !response.includes(criteria.value); // Return true if the response does not contain the value
      case "isEmail":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(response); // Return true if the response is a valid email
      case "isURL":
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(response); // Return true if the response is a valid URL
      default:
        return true; // No validation error
    }
  };

  // Validate length responses
  const validateLength = (response, criteria) => {
    if (!response) return false; // If the response is empty, validation fails
  
    const length = response.length;
  
    switch (criteria.operator) {
      case "maxChars":
        return length <= criteria.value; // Return true if the length is less than or equal to the max value
      case "minChars":
        return length >= criteria.value; // Return true if the length is greater than or equal to the min value
      default:
        return true; // No validation error
    }
  };

  // Validate regex responses
  const validateRegex = (response, criteria) => {
      const regex = new RegExp(criteria.value);
      switch (criteria.operator) {
        case "regexContains":
          return regex.test(response) || `Text should match the pattern "${criteria.value}".`;
        case "regexDoesNotContain":
          return !regex.test(response) || `Text should not match the pattern "${criteria.value}".`;
        case "regexMatches":
          return regex.test(response) || `Text should match the pattern "${criteria.value}".`;
        case "regexDoesNotMatch":
          return !regex.test(response) || `Text should not match the pattern "${criteria.value}".`;
        default:
          return true; // No validation error
      }
  };

  // Handle response changes
  const handleResponseChange = (questionIndex, e) => {
    const { value, checked } = e.target;
    const updatedResponses = [...formResponses];

    // Initialize the response for this question as an array if it doesn't exist
    if (!updatedResponses[questionIndex]) {
      updatedResponses[questionIndex] = [];
    }

    // Handle checkbox logic
    if (e.target.type === "checkbox") {
      if (checked) {
        // Add the value to the array if checked
        updatedResponses[questionIndex] = [
          ...updatedResponses[questionIndex],
          value,
        ];
      } else {
        // Remove the value from the array if unchecked
        updatedResponses[questionIndex] = updatedResponses[questionIndex].filter(
          (item) => item !== value
        );
      }
    } else {
      // Handle other input types (e.g., radio, input)
      updatedResponses[questionIndex] = value;
    }

    setFormResponses(updatedResponses);
  };

  // If no form is found, show a message
  if (!formData) {
    return (
      <div className="p-4 text-center text-gray-700">
        <p>No form found with the provided ID.</p>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => window.history.back()}
          className="mt-4"
        >
          Back
        </Button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: formData.pageBackgroundColor || "#e8f0fe" }}
    >
      <div
        className="space-y-8 bg-white rounded-lg shadow-lg max-w-3xl mx-auto border border-gray-200 p-8"
        style={{ borderTop: `8px solid ${darken(0.3, formData.pageBackgroundColor || "#e8f0fe")}` }}
      >
        {/* Form Header */}
        <div className="border-b-2 border-gray-200 pb-6 mb-6">
          <h2 className="text-4xl font-semibold text-gray-900">
            {formData.title || "Untitled Form"}
          </h2>
        </div>
  
        {/* Form Description */}
        {formData.description && (
          <Typography variant="body1" className="text-gray-700 mb-6">
            {formData.description}
          </Typography>
        )}
  
        {/* Conditional Rendering */}
        {isSubmitted ? (
          // Success Message
          <div className="text-center">
            <Typography variant="h4" className="text-green-600 mb-4">
              Your response has been submitted successfully!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.location.reload()} // Reload the page to reset the form
              className="mt-4"
            >
              Submit Another Response
            </Button>
          </div>
        ) : (
          // Form
          <form onSubmit={handleFormSubmit}>
            {formData.questions?.map((question, index) => (
              <div key={index} className="question-box w-full mb-6 p-4 border border-gray-200 rounded-lg shadow-sm">
                <p className="question-text text-xl font-medium text-gray-800 mb-4">
                  {index + 1}. {question.questionText}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </p>
  
                {/* Input Question */}
                {question.answerType === "input" && (
                  <TextField
                    type="text"
                    fullWidth
                    variant="outlined"
                    className="mb-4 mt-2"
                    value={formResponses[index] || ""}
                    onChange={(e) => handleResponseChange(index, e)}
                    placeholder="Your answer here..."
                    size="small"
                    error={!!validationErrors[index]} // Show error state
                    helperText={validationErrors[index]} // Display error message
                  />
                )}
  
                {/* Radio Buttons */}
                {question.answerType === "radio" && (
                  <>
                    <RadioGroup
                      aria-label={`radio-${index}`}
                      name={`radio-${index}`}
                      value={formResponses[index] || ""}
                      onChange={(e) => handleResponseChange(index, e)}
                      className="space-y-2"
                    >
                      {question.options.map((option, optionIndex) => (
                        <FormControlLabel
                          key={optionIndex}
                          value={option}
                          control={<Radio />}
                          label={option}
                          className="text-gray-700"
                        />
                      ))}
                    </RadioGroup>
                    {validationErrors[index] && (
                      <Typography variant="body2" className="text-red-500 mt-2">
                        {validationErrors[index]}
                      </Typography>
                    )}
                  </>
                )}
  
                {/* Checkboxes */}
                {question.answerType === "checkbox" && (
                  <>
                    <FormGroup>
                      {question.options.map((option, optionIndex) => (
                        <FormControlLabel
                          key={optionIndex}
                          control={
                            <Checkbox
                              checked={formResponses[index]?.includes(option) || false}
                              onChange={(e) => handleResponseChange(index, e)}
                              name={`checkbox-${index}`}
                              value={option}
                            />
                          }
                          label={option}
                          className="text-gray-700"
                        />
                      ))}
                    </FormGroup>
                    {validationErrors[index] && (
                      <Typography variant="body2" className="text-red-500 mt-2">
                        {validationErrors[index]}
                      </Typography>
                    )}
                  </>
                )}
  
                {/* Dropdown */}
                {question.answerType === "dropdown" && (
                  <>
                    <FormControl fullWidth variant="outlined" size="small" className="mb-2">
                      <InputLabel>Select an option</InputLabel>
                      <Select
                        value={formResponses[index] || ""}
                        onChange={(e) => handleResponseChange(index, e)}
                        label="Select an option"
                        error={!!validationErrors[index]}
                      >
                        {question.options.map((option, optionIndex) => (
                          <MenuItem key={optionIndex} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {validationErrors[index] && (
                      <Typography variant="body2" className="text-red-500 mt-2">
                        {validationErrors[index]}
                      </Typography>
                    )}
                  </>
                )}
  
                {/* Short Answer */}
                {question.answerType === "short answer" && (
                  <TextField
                    placeholder="Short Answer"
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={formResponses[index] || ""}
                    onChange={(e) => handleResponseChange(index, e)}
                    className="mb-2"
                    error={!!validationErrors[index]}
                    helperText={validationErrors[index]}
                  />
                )}
  
                {/* Paragraph */}
                {question.answerType === "paragraph" && (
                  <TextField
                    placeholder="Paragraph"
                    fullWidth
                    variant="outlined"
                    size="small"
                    multiline
                    rows={4}
                    value={formResponses[index] || ""}
                    onChange={(e) => handleResponseChange(index, e)}
                    className="mb-2"
                    error={!!validationErrors[index]}
                    helperText={validationErrors[index]}
                  />
                )}
  
                {/* Date */}
                {question.answerType === "date" && (
                  <TextField
                    type="date"
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={formResponses[index] || ""}
                    onChange={(e) => handleResponseChange(index, e)}
                    className="mb-2"
                    InputLabelProps={{ shrink: true }}
                    error={!!validationErrors[index]}
                    helperText={validationErrors[index]}
                  />
                )}
  
                {/* Time */}
                {question.answerType === "time" && (
                  <TextField
                    type="time"
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={formResponses[index] || ""}
                    onChange={(e) => handleResponseChange(index, e)}
                    className="mb-2"
                    InputLabelProps={{ shrink: true }}
                    error={!!validationErrors[index]}
                    helperText={validationErrors[index]}
                  />
                )}
              </div>
            ))}
  
            {/* Submit Button */}
            <div className="flex space-x-6 mt-8">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="w-40 py-2 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                Submit
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default FormRenderer;