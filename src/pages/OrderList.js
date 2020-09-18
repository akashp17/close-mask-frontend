import React, { useEffect, useState } from "react";

import {
  Box, Paper, Container, Typography, CircularProgress, Checkbox, FormControlLabel, Switch
} from "@material-ui/core";
import Check from "@material-ui/icons/Check";

import MUIDataTable from "mui-datatables";

import classNames from "classnames";
import { makeStyles } from '@material-ui/core/styles';

import styles from "../assets/jss/material-kit-react/views/landingPage.js";

import ErrorSnackbar from "../components/ErrorSnackbar";
import api from "../utils/api";

const useStyles = makeStyles(styles);


export default function OrderList(props) {
  const classes = useStyles();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  var [isLoading, setLoading] = useState(true);
  // var [filter, setFilter] = useState([]);
  var [tState, setTState] = useState({ // table state
    data: [["Loading..."]],
    page: 0,
    limit: 10,
    count: 1,
    sortBy: "createdAt",
    sortDirec: -1,
    columns: [
      {
        name: '_id',
        label: "_id",
        options: {
          sort: false,
          filter: false,
          display: false
        }
      },
      {
        name: 'orderId',
        label: "ID",
        options: {

        }
      },
      {
        name: 'email',
        label: "Email",
        options: {
          sortDirection: 'none'
        }
      },
      {
        name: 'phone',
        label: "Phone",
        options: {
          sortDirection: 'none'
        }
      },
      {
        name: 'price',
        label: "Items total",
        options: {
          sortDirection: 'none'
        }
      },
      {
        name: 'shippingCharge',
        label: "Shipping Charge",
        options: {
          sortDirection: 'none'
        }
      },
      {
        name: 'couponDiscountAmount',
        label: "Coupon Discount",
        options: {
          sortDirection: 'none'
        }
      },
      {
        name: 'shippingName',
        label: "Shipping Selected",
        options: {
          sortDirection: 'none'
        }
      },
      {
        name: 'products',
        label: "Products",
        options: {
          sort: false,
          filter: false,
          customBodyRender: (value) => {
            if (!value)
              return "";
            // const products = JSON.parse(value);            
            return value.map(p => <pre>{p.name} X {p.quantity}</pre>)
          }
        }
      },
      {
        name: 'address',
        label: "Address",
        options: {
          sortDirection: 'none',
          customBodyRender: (value) => <pre>{value && value.split(";").join("\n")}</pre>
        }
      },
      // {
      //   name: 'products',
      //   label: "Products",
      //   options: {
      //     sortDirection: 'none'
      //   }
      // },
      {
        name: 'delivered',
        label: "Delivered",

        options: {
          sortDirection: 'none',
          filter: false,
          customBodyRender: (value, tableMeta) => {
            var val = value == undefined ? false : value
            // console.log(tableMeta);
            return <center>
              <Switch
                tabIndex={-1}
                color="secondary"
                checked={val}
                onChange={(ev) => {
                  if (!ev.target.checked)
                    return;
                  setTState((prevState) => {
                    var newData = [...prevState.data];
                    newData[tableMeta.rowIndex].delivered = !newData[tableMeta.rowIndex].delivered;
                    setOrderDelivered(tableMeta.rowData[0]);
                    return ({
                      ...prevState,
                      data: newData
                    });
                  })
                }}
              />
            </center>
          }
        }
      },

    ]
  });

  function cleanSnackbar() {
    showSnackbar && setShowSnackbar(false);
    setErrMessage("");
  }

  async function setOrderDelivered(orderId) {
    try {
      await api.post("/order/mark-delivered", { orderId });
    }
    catch (err) {
      console.log(err);
      setErrMessage("Something went wrong, check console for error");
      setShowSnackbar(true);
    }
  }

  async function getData(page, limit, sortBy, sortDirec, filterCheck = false) {
    try {
      // var getFilters = [];
      // await setFilter(f => {
      //   getFilters = f;
      //   return f;
      // });
      // var queryFilters = [];
      // for (var i = 0; i < getFilters.length; i++) {
      //   if (getFilters[i].length == 0)
      //     continue;
      //   queryFilters.push({
      //     param: tState.columns[i].name,
      //     str: getFilters[i][0]
      //   })
      // }
      // if (filterCheck && !queryFilters.length)
      //   return;

      setLoading(true);
      let res = await api.get("/order/get", {
        params: {
          page: page + 1,
          limit,
          sortBy,
          sortDirec,
          // search: encodeURI(JSON.stringify(queryFilters))
        }
      });
      res = res.data;
      var newCols = tState.columns.map(col => {
        col.options = {
          ...col.options,
          sortDirection: col.name == sortBy ? (sortDirec == 1 ? 'asc' : 'desc') : 'none'
        };
        return col;
      })
      setTState({
        ...tState,
        data: res.data.docs,
        count: res.data.totalDocs,
        page,
        limit,
        sortBy,
        sortDirec,
        columns: newCols
      })
    }
    catch (e) {
      console.log(e);
      setErrMessage("Failed to load data, check console for error");
      setShowSnackbar(true);
      setTState({
        ...tState,
        data: [["Something went wrong, check console"]]
      });
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData(tState.page, tState.limit, tState.sortBy, tState.sortDirec);
  }, []);


  const options = {
    filter: false,
    sort: true,
    // serverSideFilterList: filter,
    // filterType: 'textField',
    // responsive: 'standard',
    selectableRows: 'none',
    serverSide: true,
    search: false,
    count: tState.count,
    page: tState.page,
    onTableChange: (action, tableState) => {
      // console.log(action, tableState);
      switch (action) {
        case 'changeRowsPerPage':
        case 'changePage':
          getData(tableState.page, tableState.rowsPerPage, tState.sortBy, tState.sortDirec);
          break;
        // case 'resetFilters':
        //   setFilter([]);
        //   getData(tableState.page, tableState.rowsPerPage, tState.sortBy, tState.sortDirec);
        //   break;
        // case 'filterChange':
        //   setFilter(tableState.filterList);
        //   break;
        // case 'onFilterDialogClose':
        //   getData(tableState.page, tableState.rowsPerPage, tState.sortBy, tState.sortDirec, true);
        //   break;
      }
    },
    onColumnSortChange: (col, direc) => {
      // console.log(col, direc);
      setLoading(true);
      getData(tState.page, tState.rowsPerPage, col, direc.charAt(0) == 'a' ? 1 : -1);
    }
  };
  // console.log("Setting", tState.data);
  return <React.Fragment>
    <Container className="main-cont">
      <Box className={classNames(classes.main, classes.mainRaised)} p="1rem">

        <MUIDataTable title={
          <Typography variant="title">
            &nbsp;&nbsp;
              {isLoading && <CircularProgress size={14} />}
          </Typography>
        } data={tState.data} columns={tState.columns} options={options} />

      </Box>
    </Container>
    <ErrorSnackbar
      showSnackbar={showSnackbar}
      cleanSnackbar={cleanSnackbar}
      errorMessage={errMessage}
    />
  </React.Fragment>;
}
