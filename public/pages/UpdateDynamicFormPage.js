import React from 'react';
import {connect} from 'react-redux';

import DynamicForm from '../../src/components/DynamicForm';
@connect()
export default class UpdateDynamicFormPage extends React.Component{
    onSubmit(er){
        console.log('回调函数onSubmit');
    }
    onSuccess(){

    }

    render(){
        return(
            <div>
                <DynamicForm
                    isUpdate={true}
                    formDefinitionSrc={`http://localhost:3000/api/getdefinition/${this.props.match && this.props.match.params.name}`}
                    formDataSrc={`http://localhost:3000/api/loadformdataById/${this.props.match && this.props.match.params.id}`}
                    submitDataSrc={`http://localhost:3000/api/UpdateFormData`}
                    _id={this.props.match && this.props.match.params.id}
                    onSuccess={this.onSuccess}
                    />
            </div>
        );
    }
}