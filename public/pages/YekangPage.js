/**
 * Created by KangYe on 2017/4/25.
 */
import React from 'react';
import DynamicForm from '../../src/components/DynamicForm';

export default class YekangPage extends React.Component{
    render(){
        return(
                <DynamicForm formDefinitionSrc="http://localhost:3000/api/getdefinition/yekang" />

        );
    }
}