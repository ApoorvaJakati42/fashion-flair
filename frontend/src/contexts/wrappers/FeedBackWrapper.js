import React , {useReducer , createContext} from 'react';
import { Snackbar } from '@material-ui/core';
import { setSnackbar } from '../actions';
import feedbackReducer from '../reducers/feedback-reducer';

export const FeedBackContext = createContext();
const FeedBackProvider = FeedBackContext.Provider;

export function FeedBackWrapper({children}) {
    const [feedback , dispatchFeedback] = useReducer(feedbackReducer , 
                    { open : false , backgroundColor : "" , message : ""})

            return (
                <FeedBackProvider value={{feedback , dispatchFeedback}}>
                    {children}
                <Snackbar 
                open={feedback.open} 
                message={feedback.message} 
                autoHideDuration={6000} //autoHideDuration calls the onClose property
                onClose={() => dispatchFeedback(setSnackbar({open : false}))}
                anchorOrigin={{vertical : "top" , horizontal : "center"}}
                ContentProps={{style : {backgroundColor : feedback.backgroundColor , fontSize : "1.25rem"}}}/>
                </FeedBackProvider>
            )        
}

