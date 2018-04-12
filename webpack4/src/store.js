import { applyMiddleware, createStore, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import { reducer as formReducer } from 'dynamicform-react-client';

const middleware = applyMiddleware(thunk);

export default createStore(
    combineReducers({
        formReducer,
    }),
    middleware
);