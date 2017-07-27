import React from 'react';
import {connect} from 'react-redux';
import {Form, Upload, Button, Icon, Modal} from 'antd';
import _ from 'lodash';
import {getIsCascadeElement} from '../../utility/common';

import {initFormData, updateFormData} from '../../actions/formAction';

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 6},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
    },
};

function mapStateToProps(store) {
    return {
        form: store.formReducer.form,
        formData: store.formReducer.formData,
        isNewForm: store.formReducer.isNewForm,
        isSubmitting: store.formReducer.isSubmitting
    };
}

export class QUpload extends React.Component {
    constructor(props) {
        super(props);
        let rules = props.definition ? props.definition.rules || [] : [];
        if(Array.isArray(rules)){
            rules = rules.concat(
                rules.map(
                    (ruleConfig) => {
                        return (rule, value, callback, source, options) => {
                            const errors = [];
                            const { getFieldValue } = props.form;
                            if( ruleConfig.required &&
                                ( !Array.isArray(value) || !value.filter(v => v.status != 'removed').length )
                            ){
                                errors.push(new Error(ruleConfig.message,rule.field));
                            }
                            callback(errors);
                        };
                    }
                )
            );
            rules = rules.map( v => {
                if( v.required ){
                    return {required: true};
                }
                return v;
            });
        }else rules = [];
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: props.value,
            ...props.definition,
            rules: rules
        };
    }
    get objectKey() {
        return this.state.name;
    }

    get objectPath() {
        return this.state.path || this.state.name;
    }
    getValue(formData){
        if(this.props.isDynamic) {
            const dataPosition = this.props.dataPosition;
            const path = `${dataPosition.objectName}[${dataPosition.index}].${this.objectPath}`;
            return _.get(formData, path);
        } else {
            return _.get(formData, this.objectPath);
        }
    }
    getDynamicKey() {
        if(this.props.isDynamic) {
            const dataPosition = this.props.dataPosition;
            const index = dataPosition.index;
            return `${this.objectKey}-${index}`;
        } else {
            return this.objectKey;
        }
    }
    getRules(){
        if(this.getHidden()==='none'||this.getDisabled()){
            return [];
        }else{
            return this.state.rules;
        }
    }
    getHidden() {
        if (!this.state.conditionMap  || this.state.conditionMap.length == 0) {
            return this.state.hidden ? 'none' : '';
        } else {
            let ElementAttribute = this.state.conditionMap.map((item, index)=> {
                let itemValue = _.get(this.props.formData, item.whichcontrol);
                switch (item.how) {
                    case 'equal': {
                        return item.value === itemValue && item.action === 'hidden' && item.actionValue ? 'none' : '';
                    }
                }
                return '';
            });
            return _.includes(ElementAttribute, 'none') ? 'none' : '';
        }
    }
    getDisabled(){
        if(!this.state.conditionMap|| this.state.conditionMap.length == 0) {
            return this.state.disabled;
        }else {
            let ElementAttribute = this.state.conditionMap.map((item, index)=> {
                let itemValue = _.get(this.props.formData, item.whichcontrol);
                switch (item.how) {
                    case 'equal': {
                        return item.value === itemValue && item.action === 'disabled' && item.actionValue;
                    }
                    case 'greater': {
                        return '';
                    }
                    case 'less': {
                        return '';
                    }
                }
            });
            return _.includes(ElementAttribute, true);
        }
    }
    componentWillMount() {
        if (this.props.isNewForm) {
            const value = this.getValue(this.props.formData);
            this.props.dispatch(initFormData(this.objectPath, value));
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            fileList: nextProps.value
        });
    }
    shouldComponentUpdate(nextProps, nextState) {
        let isCascadElement=getIsCascadeElement(nextProps.formData,this.props.formData,this.state.conditionMap);
        //only render when value is changed or form is submitting or previewVisible is changed
        return (this.state.fileList !== nextState.fileList) || 
                nextProps.isSubmitting || 
                this.state.previewVisible !== nextState.previewVisible || isCascadElement;
    }
    handleCancel = () => {this.setState({ previewVisible: false });}

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url,
            previewVisible: true,
        });
    }

    handleChange = ({ fileList }) => this.setState({ fileList })

    handleOnChange = ({file,fileList}) => {
        let value = [];
        if (fileList && _.isArray(fileList)) {
            fileList.forEach((item, index) => {
                let obj = {
                    ...item,
                    uid: item.uid || index,
                    name: item.name,
                    status: item.status,
                };
                //e.g.: response = {code:20000, data:{imagePath:"http://xxxx"}}
                if( this.state.urlKey && item.response && item.response.data ){
                    obj = {
                        ...obj,
                        ...item.response.data
                    };
                    obj.url = obj.url || item.response.data[this.state.urlKey];
                    delete obj.response;
                }
                
                value.push(obj);
            });
        }
        this.props.dispatch(updateFormData(this.objectPath, value));
    }
    
    normFile = (info) => {
        let fileList = [];
        // 如果希望组件能提供查看功能，则需要设置url字段的值
        if( this.state.urlKey ){
            fileList = this.state.fileList.map(
                (v, index) => {
                    v.uid = v.uid || index;
                    v.url = v.url || v[this.state.urlKey];
                    return v;
                }
            );
        }
        return fileList;
    }
    onRemove = (file) => {
        return true;
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        const { fileList, rules, previewVisible, previewImage } = this.state;
        let plusView = null;
        let props = {
            onChange: this.handleOnChange,
            onRemove: this.onRemove,
            listType: this.state.fileType == 'picture' ? 'picture-card' : 'text' ,
            //Required. Uploading URL
            action: this.state.action,

            fileList: this.state.fileList,
            //Whether to support selected multiple file. IE10+ supported. You can select multiple files with CTRL holding down while multiple is set to be true
            multiple: this.state.multiple,

            //disable upload button
            disabled: this.state.disabled,

            //Whether to show default upload list
            showUploadList: this.state.showUploadList,

            /*
             For Excel Files 2007+ (.xlsx), use:
             accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

             For Text Files (.txt) use:
             accept="text/plain"

             For Image Files (.png/.jpg/etc), use:
             accept="image/*"

             For HTML Files (.htm,.html), use:
             accept="text/html"

             For Video Files (.avi, .mpg, .mpeg, .mp4), use:
             accept="video/*"

             For Audio Files (.mp3, .wav, etc), use:
             accept="audio/*"

             For PDF Files, use:
             accept=".pdf"
             */
            accept: this.state.accept,
        };
        if( this.state.fileType == 'picture' ){
            props.listType = 'picture-card';
            props.onPreview = this.handlePreview;
            plusView = (
                <div>
                    <Icon type="plus" />
                    <div className="ant-upload-text">Upload</div>
                </div>
            );
        }else {
            props.listType = 'text';
            plusView = (
                <Button>
                    <Icon type="upload"/> Upload
                </Button>
            );
        }
        const key = this.getDynamicKey();
        return (
            <FormItem {...formItemLayout} style={{display:this.getHidden()}}  label={this.state.label}>
                {getFieldDecorator(key, {
                    rules: this.getRules(),
                    initialValue: fileList,
                    getValueFromEvent: this.normFile,
                })(
                    <Upload {...props} disabled={this.state.disabled} >
                        {plusView}
                        <Modal 
                            visible={previewVisible} 
                            footer={null} 
                            onCancel={this.handleCancel}
                        >
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                    </Upload>
                )}
            </FormItem>
        );
    }
}

export default connect(mapStateToProps)(QUpload);