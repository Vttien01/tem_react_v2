import { Card, Col, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import TextField from '@components/common/form/TextField';
import CropImageField from '@components/common/form/CropImageField';
import { AppConstants } from '@constants';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
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
    confirmPassword: 'Confirm New Password',
    passwordNotMatch: 'Password not match',
    password: 'Password',
    email: 'Email',
    phone: 'Phone',
});

const UserAdminForm = (props) => {
    const translate = useTranslate();
    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues, groups, branchs, isEditing } = props;
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const [imageUrl, setImageUrl] = useState(null);

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

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values, avatar: imageUrl });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
        setImageUrl(dataDetail.avatar);
    }, [dataDetail]);

    return (
        <Form
            style={{ width: '70%' }}
            id={formId}
            onFinish={handleSubmit}
            form={form}
            layout="vertical"
            onValuesChange={onValuesChange}
        >
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <CropImageField
                            label={translate.formatMessage(message.avatar)}
                            name="avatar"
                            imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                            aspect={1 / 1}
                            uploadFile={uploadFile}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(message.username)} name="username" />
                    </Col>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(message.fullName)} required name="fullName" />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(message.password)}
                            required={!isEditing}
                            name="password"
                            type="password"
                            rules={[
                                {
                                    validator: async () => {
                                        const isTouched = form.isFieldTouched('password');
                                        if (isTouched) {
                                            const value = form.getFieldValue('password');
                                            if (value.length < 6) {
                                                throw new Error(translate.formatMessage(message.validatePassword));
                                            }
                                        }
                                    },
                                },
                            ]}
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(message.confirmPassword)}
                            required={!isEditing}
                            name="confirmPassword"
                            type="password"
                            rules={[
                                {
                                    validator: async () => {
                                        const password = form.getFieldValue('password');
                                        const confirmPassword = form.getFieldValue('confirmPassword');
                                        if (password !== confirmPassword) {
                                            throw new Error(translate.formatMessage(message.passwordNotMatch));
                                        }
                                    },
                                },
                            ]}
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(message.email)} name="email" type="email" />
                    </Col>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(message.phone)} required name="phone" type="number" />
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </Form>
    );
};

export default UserAdminForm;
