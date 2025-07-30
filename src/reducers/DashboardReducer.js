import { dashboardOptions, utilOptions, dashboardTabs } from "../utils/constants";

//useReducer with some() for increased readability
function DashboardReducer(state, action) {
  //Initialise payload as null
  let payload = null;

  //map through the dashboardOptions to compare each option type with action type
  [...dashboardOptions, ...utilOptions, ...dashboardTabs].some((element) => {
    /*if element is found, assign to the action payload to the palyload variable,
          together the state. and return true to break out of loop (some),
          else return false and continue to loop through the elements
        */
    if (element.type === action.type) {
      payload = { ...action };
      return true;
    }
    return false;
  });

  //assign state to payload if payload is null (if type is not found in dashboardOptions)
  if (payload === null) {
    payload = state;
  }

  //return payload
  return payload;
}

export default DashboardReducer;
