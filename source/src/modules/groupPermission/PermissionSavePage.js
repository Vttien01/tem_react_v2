import PageWrapper from '@components/common/layout/PageWrapper';
import { STATUS_ACTIVE, UserTypes } from '@constants';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import useSaveBase from '@hooks/useSaveBase';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PermissionForm from './PermissionForm';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';

const message = defineMessages({
    objectName: 'group permission',
    home: 'Home',
    groupPermission: 'Group Permission',
});

const PermissionSavePage = () => {
    const translate = useTranslate();
    const { id } = useParams();
    const [permissions, setPermissions] = useState([]);
    const { execute: executeGetPermission } = useFetch(apiConfig.groupPermission.getPemissionList, {
        immediate: false,
    });

    const { detail, mixinFuncs, loading, onSave, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.groupPermission.getById,
            create: apiConfig.groupPermission.create,
            update: apiConfig.groupPermission.update,
        },
        options: {
            getListUrl: `/group-permission`,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    status: STATUS_ACTIVE,
                    kind: UserTypes.ADMIN,
                    avatarPath: data.avatar,
                    ...data,
                    id: id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    kind: UserTypes.ADMIN,
                    avatarPath: data.avatar,
                };
            };
            funcs.mappingData = (response) => {
                if (response.result === true)
                    return {
                        ...response.data,
                        permissions: response.data?.permissions
                            ? response.data?.permissions.map((permission) => permission.id)
                            : [],
                    };
            };
        },
    });

    useEffect(() => {
        executeGetPermission({
            params: {
                size: 1000,
            },
            onCompleted: (res) => {
                setPermissions(res?.data?.data);
            },
        });
    }, []);

    return (
        <PageWrapper
            loading={loading}
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                { breadcrumbName: translate.formatMessage(message.groupPermission), path: `/group-permission` },
                { breadcrumbName: title },
            ]}
        >
            <PermissionForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={onSave}
                permissions={permissions || []}
            />
        </PageWrapper>
    );
};

export default PermissionSavePage;
