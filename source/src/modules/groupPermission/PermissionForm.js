import { Card, Checkbox, Col, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import TextField from '@components/common/form/TextField';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';

const message = defineMessages({
    name: 'Name',
    description: 'Description',
    groupPermission: 'Group Permission',
});

const PermissionForm = (props) => {
    const translate = useTranslate();
    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues, isEditing, permissions } = props;
    const [ group, setGroup ] = useState([]);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });


    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values });
    };

    const getGroupPermission = () => {
        const { permissions } = props;
        let groups;
        if (permissions && permissions.length > 0) {
            groups = permissions.reduce((r, a) => {
                r[a.nameGroup] = [ ...(r[a.nameGroup] || []), a ];
                return r;
            }, {});
        }
        setGroup(groups);
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
    }, [ dataDetail ]);

    useEffect(() => {
        if (permissions.length !== 0) getGroupPermission();
    }, [ permissions ]);

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
                        <TextField label={translate.formatMessage(message.name)} required name="name" />
                    </Col>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(message.description)} type="textarea" name="description" />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="permissions"
                            label={translate.formatMessage(message.groupPermission)}
                            rules={[ { required: true, message: 'permission' } ]}
                        >
                            <Checkbox.Group
                                style={{ width: '100%', display: 'block' }}
                                name="permissions"
                            >
                                {group
                                    ? Object.keys(group).map((groupName) => (
                                        <Card
                                            key={groupName}
                                            size="small"
                                            title={groupName}
                                            style={{ width: '100%', marginBottom: '4px' }}
                                        >
                                            <Row>
                                                {group[groupName].map((permission) => (
                                                    <Col span={8} key={permission.id}>
                                                        <Checkbox value={permission.id}>{permission.name}</Checkbox>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Card>
                                    ))
                                    : null}
                            </Checkbox.Group>
                        </Form.Item>
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </Form>
    );
};

export default PermissionForm;
