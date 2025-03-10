export const addQuestion = (question) => {
  return {
    type: "ADD_QUESTION",
    payload: question
  };
};

export const addFormField = (questionIndex, fieldType) => {
  return {
    type: "ADD_FORM_FIELD",
    payload: {
      questionIndex,
      fieldType
    }
  };
};

export const saveForm = () => {
  return {
    type: "SAVE_FORM"
  };
};

export const saveFormResponses = (responses) => {
  return {
    type: "SAVE_FORM_RESPONSES",
    payload: responses
  };
};
