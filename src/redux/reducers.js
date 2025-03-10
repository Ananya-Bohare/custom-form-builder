const initialState = {
  questions: [],
  isFormSaved: false,
  formResponses: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_QUESTION":
      return {
        ...state,
        questions: [...state.questions, action.payload]
      };
    case "ADD_FORM_FIELD":
      return {
        ...state,
        questions: state.questions.map((question, index) => {
          if (index === action.payload.questionIndex) {
            return {
              ...question,
              formFields: [...question.formFields, action.payload.fieldType]
            };
          }
          return question;
        })
      };
    case "SAVE_FORM":
      return {
        ...state,
        isFormSaved: true
      };
    case "SAVE_FORM_RESPONSES":
      return {
        ...state,
        formResponses: action.payload
      };
    default:
      return state;
  }
};

export default reducer;
