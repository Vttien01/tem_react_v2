import { validatePermission } from '@utils';
import React, { useCallback } from 'react';
import useAuth from './useAuth';

function useValidatePermission() {
    const { permissions, kind, profile } = useAuth();

    const hasPermission = useCallback(
        (requiredPermissions, requiredKind, excludeKind, onValidate = validatePermission) => {
            const _onValidate = onValidate ?? validatePermission;
            return _onValidate(
                requiredPermissions,
                permissions,
                requiredKind,
                excludeKind,
                kind,
                profile
            );
        },
        [permissions, kind]
    );

    return hasPermission;
}

export default useValidatePermission;
