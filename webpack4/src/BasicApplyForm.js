/**
 * Created by YabinLi on 2018/3/23.
 */
import React, { Component } from 'react';
import { DynamicForm } from 'dynamicform-react-client';
import { Provider } from 'react-redux';
import { message } from 'antd';
import store from './store';
// import axios from '../../config/http';
export default class BasicApplyForm extends React.Component {
    constructor(props) {
        super(props);
    }
    beforeSubmit() {
        console.log('回调函数beforeSubmit');
    }
    onSuccess(resp) {
        console.log(resp);
        console.log('回调函数onSuccess');
    }
    onError(error) {
        console.log(error);
        console.log('回调函数onError')
    }
    onSubmit(formData) {
        if (formData) {
            var loanData = formData.loanData;
            var contactInfo = loanData.contactInfo;
            var loanAppInfo = loanData.loanAppInfo;
            for (var i = 1; i < contactInfo.length + 1; i++) {
                contactInfo[i].contactProperty = "CONTACT_RELATIVE" + i;
            }
            var productCodeArray = loanAppInfo.productCode.split("-");
            loanAppInfo.loanMaturity = productCodeArray[productCodeArray.length - 1];
            loanAppInfo.appCityName = loanAppInfo.appCity[1];
            loanAppInfo.appStore = loanAppInfo.appCity[1];
            loanAppInfo.appStoreName = loanAppInfo.appCity[1];
            loanAppInfo.appCity = loanAppInfo.appCity[0];

            var data = {
                "data": formData,
                "token": "AT-3283-UbSUn0jpBlTjZofM241BrGBEoJXubTeVkpq"
            };
            // axios.post('/api/basicApply', data).then((response) => {
            //     message.success('保存成功！');
            //     window.location.hash = '/loanList';
            // }).catch((error) => {
            //     console.error("页面%s提交数据-异常,token=%s,错误详情=%s", "BasicApplyForm", data.token, JSON.stringify(error));
            // });
        }

    }
    render() {
        return (
            <div>
                <Provider store={store}>
                    <DynamicForm
                        formDefinitionSrc='http://172.16.6.52:3000/api/getdefinition/BorrowerLiteAddApplication'
                        _id={''}
                        beforeSubmit={this.beforeSubmit()}
                        onSuccess={this.onSuccess()}
                        onError={this.onError()}
                        onSubmit={this.onSubmit()}
                    >
                    </DynamicForm>
                </Provider>
            </div>
        )
    }
}