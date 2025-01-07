import {
  Button,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  DialogTitle,
  DialogActions,
  Divider,
} from "@mui/material";
import { Search, Edit } from "@mui/icons-material";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import DeleteIcon from "@mui/icons-material/Delete";
import useHasPermission from "@/hooks/useHasPermission";
import ICustomer from "@/interfaces/models/ICustomer";
import { useCreateCustomer, useCustomers, useRemoveCustomer, useUpdateCustomer } from "@/network/customer";
import CustomerForm from "./Form";
import { omit } from "lodash";

const Customers = () => {
  const [page, setPage] = useState<number>(1);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<boolean>(false);

  const [searchText, setSearchText] = useState<string>();

  const [status, setStatus] = useState<number>();

  const [filters, setFilters] = useState<{
    isActive?: boolean;
    searchText?: string;
    roleId?: string;
  }>();

  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer>();

  const customersRequest = useCustomers(
    { page: page!, pageSize: 10, ...filters },
    { initialData: { data: { data: [] } } }
  );

  const hasPermission = useHasPermission()
  const createcustomerRequest = useCreateCustomer();
  const updatecustomerRequest = useUpdateCustomer();
  const removecustomerRequest = useRemoveCustomer();
  const queryClient = useQueryClient();

  const customerList = customersRequest.data?.data || [];

  const onEdit = (customer: ICustomer) => {
    setSelectedCustomer(customer);
    setShowForm(true);
  };

  const onRemove = (customer: ICustomer) => {
    setSelectedCustomer(customer);
    setShowRemoveConfirm(true);
  };

  const onClose = () => {
    setSelectedCustomer(undefined);
    setShowForm(false);
  };

  const onRemoveClose = () => {
    setSelectedCustomer(undefined);
    setShowRemoveConfirm(false);
  };

  const onSearch = () => {
    let isActive;
    if (status === 1) isActive = true;
    if (status === 0) isActive = false;

    setFilters({ searchText, isActive });
  };

  const onSave = async (payload: CustomerForm) => {
    const params = {
      ...omit(payload, ["status"]),
      id: selectedCustomer?.id,
      isActive: !!payload.status,
    } as unknown as ICustomer;

    if (selectedCustomer) await updatecustomerRequest.mutateAsync(params);
    else await createcustomerRequest.mutateAsync(params);

    queryClient.invalidateQueries({ queryKey: ["fetchCustomers"] });
    toast.success("Usuario guardado exitosamente");
    onClose();
  };

  const onConfirmRemove = async () => {
    await removecustomerRequest.mutateAsync(selectedCustomer!.id);

    onRemoveClose();
    queryClient.invalidateQueries({ queryKey: ["fetchCustomers"] });
    toast.success("Usuario eliminado exitosamente");
    onRemoveClose();
  };

  return (
    <Stack spacing={2}>
      <Stack
        direction={{ md: "row", xs: "column" }}
        spacing={1}
        justifyContent="space-between"
        alignItems={{ md: "center", xs: "flex-start" }}
      >
        <Typography color="info" fontWeight="bold" variant="h4">
          Administracion de Clientes
        </Typography>
        {hasPermission("customers.create") && (
          <Button onClick={() => setShowForm(true)} variant="contained">
            Crear nuevo cliente
          </Button>
        )}
      </Stack>

      <Grid2 spacing={1} container>
        <Grid2 size={{ xs: 13, md: 3 }}>
          <TextField
            label="Nombre"
            placeholder="Ingrese nombre de cliente"
            size="small"
            fullWidth
            value={searchText}
            onChange={(evt) => setSearchText(evt.target.value)}
          />
        </Grid2>
        <Grid2 size={{ xs: 13, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel size="small" id="status-select-label">
              Estatus
            </InputLabel>
            <Select
              size="small"
              labelId="status-select-label"
              id="status-select"
              label="Estatus"
              value={status}
              onChange={(evt) => setStatus(+evt.target.value)}
            >
              <MenuItem value={1}>Activo</MenuItem>
              <MenuItem value={0}>Inactivo</MenuItem>
              <MenuItem value={2}>Todos</MenuItem>
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 size={{ xs: 13, md: 3 }}>
          <IconButton color="secondary" onClick={onSearch}>
            <Search />
          </IconButton>
        </Grid2>
      </Grid2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: "bold", maxWidth: 100 }}>
                Email
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", maxWidth: 100 }}>
                Telefono
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Estatus</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customerList.map((customer, index) => (
              <TableRow key={index}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.isActive ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>
                  {hasPermission("customers.edit") && (
                    <IconButton onClick={() => onEdit(customer)}>
                      <Edit />
                    </IconButton>
                  )}
                  {hasPermission("customers.delete") && (
                    <IconButton onClick={() => onRemove(customer)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}

            {customerList!.length === 0 && (
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

      {customerList.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={customersRequest.data?.pageCount}
            color="primary"
            page={page}
            onChange={(_, value) => setPage(value)}
          />
        </Box>
      )}

      <Dialog open={showForm} fullWidth maxWidth="sm" onClose={onClose}>
        <DialogContent>
          <CustomerForm
            customer={selectedCustomer}
            onCancel={onClose}
            onSave={onSave}
            isLoading={createcustomerRequest.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={showRemoveConfirm}
        fullWidth
        maxWidth="sm"
        onClose={onClose}
      >
        <DialogTitle>Confirmar Eliminacion</DialogTitle>
        <Divider />
        <DialogContent>
          <span>Esta seguro que desea eliminar este cliente?</span>
        </DialogContent>
        <DialogActions>
          <Button onClick={onRemoveClose}>No</Button>
          <Button disabled={createcustomerRequest.isPending} onClick={onConfirmRemove}>Si</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default Customers;
