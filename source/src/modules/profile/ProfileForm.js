import TextField from '@components/common/form/TextField';
import { Card, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import CropImageField from '@components/common/form/CropImageField';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { AppConstants } from '@constants';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';

const message = defineMessages({
    objectName: 'group permission',
    avatar: 'Avatar',
    username: 'Username',
    fullName: 'Full name',
    currentPassword: 'Current password',
    newPassword: 'New password',
    validatePassword: 'Password must be at least 6 characters',
    confirmPassword: 'Confirm password',
    passwordNotMatch: 'Password not match',
});

const ProfileForm = (props) => {
    const translate = useTranslate();
    const { formId, dataDetail, onSubmit, setIsChangedFormValues, actions } = props;
    const [imageUrl, setImageUrl] = useState(null);
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const uploadFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'AVATAR',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
                    setImageUrl(response.data.filePath);
                }
            },
            onError: (error) => {
                onError();
            },
        });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
            city: dataDetail.info?.city,
            country: dataDetail.info?.country,
            jobTitle: dataDetail.info?.jobTitle,
            department: dataDetail.info?.department,
            employeeId: dataDetail.info?.employeeId,
            postalCode: dataDetail.info?.postalCode,
        });
        setImageUrl(dataDetail.avatar);
    }, [dataDetail]);

    const handleFinish = (values) => {
        mixinFuncs.handleSubmit({
            fullName: values.fullName,
            oldPassword: values.oldPassword,
            password: values.password,
            avatar: imageUrl,
        });
    };

    return (
        <Card className="card-form" bordered={false} style={{ minHeight: 'calc(100vh - 190px)' }}>
            <Form
                style={{ width: '50%' }}
                labelCol={{ span: 8 }}
                id={formId}
                onFinish={handleFinish}
                form={form}
                layout="horizontal"
                onValuesChange={onValuesChange}
            >
                <CropImageField
                    label={translate.formatMessage(message.avatar)}
                    name="avatar"
                    imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                    aspect={1 / 1}
                    uploadFile={uploadFile}
                />
                <TextField readOnly label={translate.formatMessage(message.username)} name="username" />
                <TextField label={translate.formatMessage(message.fullName)} name="fullName" />
                <TextField
                    type="password"
                    label={translate.formatMessage(message.currentPassword)}
                    required
                    name="oldPassword"
                />
                <TextField
                    type="password"
                    label={translate.formatMessage(message.newPassword)}
                    name="password"
                    rules={[
                        {
                            validator: async () => {
                                const isTouched = form.isFieldTouched('newPassword');
                                if (isTouched) {
                                    const value = form.getFieldValue('newPassword');
                                    if (value.length < 6) {
                                        throw new Error(translate.formatMessage(message.validatePassword));
                                    }
                                }
                            },
                        },
                    ]}
                />
                <TextField
                    type="password"
                    label={translate.formatMessage(message.confirmPassword)}
                    rules={[
                        {
                            validator: async () => {
                                const password = form.getFieldValue('newPassword');
                                const confirmPassword = form.getFieldValue('confirmPassword');
                                if (password !== confirmPassword) {
                                    throw new Error(translate.formatMessage(message.passwordNotMatch));
                                }
                            },
                        },
                    ]}
                />

                <div className="footer-card-form">{actions}</div>
            </Form>
        </Card>
    );
};

export default ProfileForm;