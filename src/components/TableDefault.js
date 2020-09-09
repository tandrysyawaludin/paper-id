import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Title from "./Title";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "IDR",
});

const TableDefault = ({
  title = "",
  dataTable = [],
  dataAccountType = [],
  handleDelete,
  handleUpdate,
}) => {
  const hasActions =
    typeof handleDelete === "function" || typeof handleUpdate === "function";

  return (
    <React.Fragment>
      <Title>{title}</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell>Account Type</TableCell>
            {hasActions && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        {/* {JSON.stringify(dataTable)} */}
        <TableBody>
          {dataTable.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.createdAt.toDate().toDateString()}</TableCell>
              <TableCell align="right">
                {formatter.format(row.amount)}
              </TableCell>
              <TableCell>
                {
                  dataAccountType.find(
                    (dataAT) => dataAT.id === row.accountTypeId
                  )?.name
                }
              </TableCell>
              {hasActions && (
                <TableCell>
                  <ButtonGroup
                    variant="contained"
                    color="primary"
                    aria-label="contained primary button group"
                  >
                    <Button
                      onClick={() => {
                        handleDelete(row.id, "transactions");
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      onClick={() => {
                        handleUpdate(row, "transactions");
                      }}
                    >
                      Update
                    </Button>
                  </ButtonGroup>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
};

export default TableDefault;
