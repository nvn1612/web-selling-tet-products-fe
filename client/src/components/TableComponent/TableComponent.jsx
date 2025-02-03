import { Table } from "antd";
import React, { useState, useRef } from "react";
import Loading from "../LoadingComponent/LoadingComponent";
import { DownloadTableExcel } from "react-export-table-to-excel";

const TableComponent = (props) => {
  const {
    isPending = false,
    data = [],
    columns = [],
    handleDeleteMany,
  } = props;
  const [selectionType, setSelectionType] = useState("checkbox");
  const [rowSelectedKey, setRowSelecteKey] = useState([]);
  const tableRef = useRef(null);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelecteKey(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
  };

  const handleDeleteAll = () => {
    handleDeleteMany(rowSelectedKey);
  };

  return (
    <Loading isLoading={isPending}>
      {rowSelectedKey.length > 0 && (
        <div
          style={{
            background: "green",
            color: "#fff",
            padding: "10px",
            cursor: "pointer",
            fontSize: "15px",
          }}
          onClick={handleDeleteAll}
        >
          Xoá tất cả
        </div>
      )}
      <DownloadTableExcel
        filename="users table"
        sheet="users"
        currentTableRef={tableRef.current ? tableRef.current : null}
      >
        <button> Export excel </button>
      </DownloadTableExcel>
      <Table
        ref={tableRef}
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        {...props}
      />
    </Loading>
  );
};

export default TableComponent;
