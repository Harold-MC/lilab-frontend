import {
  Button,
  Stack,
  TextField,
  Typography,
  FormControl,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Grid2,
  Dialog,
  DialogContent,
  Autocomplete,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import useHasPermission from "@/hooks/useHasPermission";
import { useAccessList, useCreateAccess } from "@/network/access";
import IAccess from "@/interfaces/models/IAccess";
import { AccessFormType } from "./schema";
import AccessForm from "./Form";
import { useCustomers } from "@/network/customer";
import ICustomer from "@/interfaces/models/ICustomer";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { accessTypeName } from "@/utils/enums";

const AccessList = () => {
  const [page, setPage] = useState<number>(1);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedAccess, setSelectedAccess] = useState<IAccess>();
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer>();
  const [since, setSince] = useState<Date>();
  const [until, setUntil] = useState<Date>();

  const hasPermission = useHasPermission();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<
    Partial<{
      customerId: string;
      since: Date;
      until: Date;
    }>
  >();

  const accessRequest = useAccessList(
    { page: page!, pageSize: 10, ...filters },
    { initialData: { data: { data: [] } } }
  );

  const createcustomerRequest = useCreateAccess();
  const customersRequest = useCustomers({ pageSize: -1 });

  const customerList = customersRequest.data?.data || [];
  const accessList = accessRequest.data?.data || [];

  const onClose = () => {
    setSelectedAccess(undefined);
    setShowForm(false);
  };

  const onSearch = () => {
    setFilters({ since, until, customerId: selectedCustomer?.id });
  };

  const formatDate = (date: string) => {
    return dayjs(date).format("DD/MM/YYYY HH:mm:ss A");
  };

  const onSave = async (payload: AccessFormType) => {
    await createcustomerRequest.mutateAsync(payload);

    queryClient.invalidateQueries({ queryKey: ["fetchAccessList"] });
    toast.success("Acceso guardado exitosamente");
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2}>
        <Stack
          direction={{ md: "row", sm: "row", xs: "column" }}
          spacing={1}
          justifyContent="space-between"
          alignItems={{ md: "center", xs: "flex-start" }}
        >
          <Typography color="info" fontWeight="bold" variant="h4">
            Accesos
          </Typography>
          {hasPermission("customers.create") && (
            <Button onClick={() => setShowForm(true)} variant="contained">
              Registrar Acceso
            </Button>
          )}
        </Stack>

        <Grid2 spacing={1} container>
          <Grid2 size={{ xs: 12, md: 3 }}>
            <FormControl sx={{ padding: 1 }} fullWidth>
              <Autocomplete
                disablePortal
                options={customerList}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField {...params} label="Cliente" />
                )}
                value={selectedCustomer}
                onChange={(_, val) => setSelectedCustomer(val!)}
              />
            </FormControl>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 3 }}>
            <DemoContainer
              sx={{ padding: 1 }}
              components={["DateTimePicker", "DateTimePicker"]}
            >
              <DateTimePicker
                label="Desde"
                value={since ? dayjs(since) : null}
                onChange={(newValue) => setSince(newValue?.toDate())}
              />
            </DemoContainer>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 3 }}>
            <DemoContainer
              sx={{ padding: 1 }}
              components={["DateTimePicker", "DateTimePicker"]}
            >
              <DateTimePicker
                label="Hasta"
                value={until ? dayjs(until) : null}
                onChange={(newValue) => setUntil(newValue?.toDate())}
              />
            </DemoContainer>
          </Grid2>

          <Grid2
            sx={{ alignItems: "center", display: "flex" }}
            size={{ xs: 12, md: 3 }}
          >
            <IconButton color="secondary" onClick={onSearch}>
              <Search />
            </IconButton>
          </Grid2>
        </Grid2>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Cliente</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Fecha</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Tipo de Acceso
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accessList.map((access, index) => (
                <TableRow key={index}>
                  <TableCell>{access.customer.name}</TableCell>
                  <TableCell>{formatDate(access.date as string)}</TableCell>
                  <TableCell>{accessTypeName[access.type]}</TableCell>
                </TableRow>
              ))}

              {accessList!.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body1" color="textSecondary">
                      No se encontraron resultados
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {accessList.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Pagination
              count={accessRequest.data?.pageCount}
              color="primary"
              page={page}
              onChange={(_, value) => setPage(value)}
            />
          </Box>
        )}

        <Dialog open={showForm} fullWidth maxWidth="sm" onClose={onClose}>
          <DialogContent>
            <AccessForm
              customers={customerList}
              access={selectedAccess}
              onCancel={onClose}
              onSave={onSave}
              isLoading={createcustomerRequest.isPending}
            />
          </DialogContent>
        </Dialog>
      </Stack>
    </LocalizationProvider>
  );
};

export default AccessList;
