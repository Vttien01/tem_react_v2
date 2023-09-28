import React from 'react';
import { Table } from 'antd';
import styles from './BaseTable.module.scss';
import classNames from 'classnames';

const BaseTable = ({onClickRow,dataSource, onChange, rowSelection, columns, loading, pagination, rowKey = (record) => record.id, ...props }) => {
    return (
        <Table
            onRow ={onClickRow}
            onChange={onChange}
            scroll={{ x: true }}
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            rowKey={rowKey}
            rowSelection={rowSelection}
            className={classNames(styles.baseTable, props.className)}
            pagination={pagination ? { ...pagination, showSizeChanger: false, hideOnSinglePage: true } : false}
        />
    );
};

export default BaseTable;
