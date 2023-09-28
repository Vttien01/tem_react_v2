import React, { useEffect, useState } from 'react';
import useQueryParams from './useQueryParams';
import useFetch from './useFetch';
import { useParams, useLocation } from 'react-router-dom';
import { Button, Col, Row } from 'antd';
import { SaveOutlined, StopOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { showErrorMessage } from '@services/notifyService';
import { defineMessages, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import useNotification from './useNotification';
import { useDispatch } from 'react-redux';
import { appActions } from '@store/actions';

const message = defineMessages({
    createSuccess: 'Create {objectName} success',
    updateSuccess: 'Update {objectName} success',
    yes: 'Yes',
    cancel: 'Cancel',
    create: 'Create',
    update: 'Update',
    title: '{action, select, true {Edit} other {New}} {objectName}',
});

const useSaveBase = ({
    apiConfig = {
        getById: null,
        create: null,
        update: null,
    },
    options = {
        objectName: '',
        getListUrl: '',
    },
    override,
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    const { params: queryParams, setQueryParams } = useQueryParams();
    const [detail, setDetail] = useState({});
    const [errors, setErrors] = useState({});
    const [detailId, setDetailId] = useState(params.id);
    const [isSubmitting, setSubmit] = useState(false);
    const [isChanged, setChange] = useState(false);
    const [isEditing, setEditing] = useState(
        params.id === 'create' ? false : true
    );
    const { execute: executeGet, loading } = useFetch(apiConfig.getById, {
        immediate: false,
    });
    const { execute: executeCreate, loading: loadingCreate } = useFetch(apiConfig.create, { immediate: false });
    const { execute: executeUpdate, loading: loadingUpdate } = useFetch(apiConfig.update, { immediate: false });
    const intl = useIntl();
    const title = intl.formatMessage(message.title, {
        action: isEditing,
        objectName: options.objectName,
    });
    const notification = useNotification();
    // const [ filter, setFilter ] = useState({});

    const mappingData = (response) => {
        if (response.result === true) return response.data;
    };

    const handleGetDetailError = (error) => {
        // console.log({ error });
    };

    const handleFetchDetail = (params) => {
        executeGet({
            ...params,
            pathParams: { id: detailId },
            onCompleted: (response) => {
                setDetail(mixinFuncs.mappingData(response));
            },
            onError: mixinFuncs.handleGetDetailError,
        });
    };

    const getDetail = () => {
        mixinFuncs.handleFetchDetail(detailId);
    };

    const getFormId = () => {
        return `form-${location.pathname}`;
    };

    const onBack = () => {
        const doBack = () => {
            if (location?.state?.prevPath === options.getListUrl) {
                navigate(location.state.prevPath+location.search);
                console.log("doBack 1 "+JSON.stringify(location));
            } 
            else {
                navigate(options.getListUrl);
                console.log("doBack 2");
            }
        };

        // if (isChanged) {
        //     showWarningConfirmModal({
        //         title: 'Quay lại',
        //         onOk: doBack,
        //     });
        // } else {
        // }
        doBack();
    };

    const showWarningConfirmModal = ({ onOk, title = null, ...rest } = {}) => {
        confirm({
            title: title,
            centered: true,
            width: 475,
            okType: 'danger',
            className: 'custom-confirm-modal warning',
            icon: <ExclamationCircleOutlined />,
            onOk: onOk,
            ...rest,
        });
    };

    const prepareCreateData = (data) => {
        return data;
    };

    const prepareUpdateData = (data) => {
        return {
            ...data,
            id: detail.id,
        };
    };

    const onSave = (values) => {
        dispatch(appActions.saveData({ key: null, data: null }));
        setSubmit(true);
        if (isEditing) {
            executeUpdate({
                data: mixinFuncs.prepareUpdateData(values),
                onCompleted: mixinFuncs.onSaveCompleted,
                onError: mixinFuncs.onSaveError,
            });
        } else {
            executeCreate({
                data: mixinFuncs.prepareCreateData(values),
                onCompleted: mixinFuncs.onSaveCompleted,
                onError: mixinFuncs.onSaveError,
            });
        }
    };

    const onSaveCompleted = (responseData) => {
        console.log(responseData);

        setSubmit(false);
        if (responseData?.data?.errors?.length) {
            mixinFuncs.onSaveError();
        } else {
            if (isEditing) {
                mixinFuncs.onUpdateCompleted(responseData);
            } else {
                mixinFuncs.onInsertCompleted(responseData);
            }
        }
    };

    const getActionName = () => {
        return isEditing ? 'Update' : 'Create';
    };

    const onUpdateCompleted = (responseData) => {
        if (responseData.result === true) {
            notification({
                message: intl.formatMessage(message.updateSuccess, {
                    objectName: options.objectName,
                }),
            });
            mixinFuncs.onBack();
        }
    };

    const onInsertCompleted = (responseData) => {
        if (responseData.result === true) {
            notification({
                message: intl.formatMessage(message.createSuccess, {
                    objectName: options.objectName,
                }),
            });
            mixinFuncs.onBack();
        }
    };

    const handleShowErrorMessage = (err, showErrorMessage) => {
        if (err && err.message) showErrorMessage(err.message);
        else showErrorMessage(`${getActionName()} failed. Please try again!`);
    };

    const onSaveError = (err) => {
        const { status, data } = err.response;
  
        const errors1 = data.data.reduce((acc, error) => {
            acc[error.field] = error.message;
            return acc;
        }, {});

        setErrors(errors1);
        mixinFuncs.handleShowErrorMessage(err, showErrorMessage);
        setSubmit(false);
    };

    const setIsChangedFormValues = (flag) => {
        if (flag !== isChanged) {
            setChange(flag);
        }
    };

    const renderActions = (customDisabledSubmitValue) => {
        const disabledSubmit = customDisabledSubmitValue !== undefined ? customDisabledSubmitValue : !isChanged;
        return (
            <Row justify="end" gutter={12}>
                <Col>
                    <Button danger key="cancel" onClick={mixinFuncs.onBack} icon={<StopOutlined />}>
                        {intl.formatMessage(message.cancel)}
                    </Button>
                </Col>
                <Col>
                    <Button
                        key="submit"
                        htmlType="submit"
                        type="primary"
                        form={mixinFuncs.getFormId()}
                        loading={isSubmitting}
                        disabled={disabledSubmit}
                        icon={<SaveOutlined />}
                    >
                        {isEditing ? intl.formatMessage(message.update) : intl.formatMessage(message.create)}
                    </Button>
                </Col>
            </Row>
        );
    };

    const overrideHandler = () => {
        const centralizedHandler = {
            getDetail,
            handleFetchDetail,
            mappingData,
            handleGetDetailError,
            getFormId,
            renderActions,
            prepareCreateData,
            prepareUpdateData,
            onSaveCompleted,
            onUpdateCompleted,
            onInsertCompleted,
            onSaveError,
            onSave,
            executeGet,
            executeCreate,
            executeUpdate,
            setDetail,
            setEditing,
            handleShowErrorMessage,
            getActionName,
            onBack,
        };

        override?.(centralizedHandler);

        return centralizedHandler;
    };

    const mixinFuncs = overrideHandler();

    useEffect(() => {
        if (params.id) {
            if (params.id === 'create') setEditing(false);
            else mixinFuncs.getDetail();
        }
    }, []);

    return {
        detail,
        mixinFuncs,
        loading,
        onSave,
        setIsChangedFormValues,
        isEditing,
        title,
        setEditing,
        errors,
    };
};

export default useSaveBase;